import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Float "mo:core/Float";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type Scenario = {
    title : Text;
    prompt : Text;
  };

  module Scenario {
    public func compare(a : Scenario, b : Scenario) : Order.Order {
      Text.compare(a.title, b.title);
    };
  };

  public type Message = {
    sender : Text;
    content : Text;
    time : Int;
  };

  public type Session = {
    id : Text;
    scenario : Scenario;
    startTime : Int;
    endTime : ?Int;
    messages : [Message];
    confidenceScores : [Float];
    analysisSummary : Text;
  };

  module Session {
    public func compare(a : Session, b : Session) : Order.Order {
      Text.compare(a.id, b.id);
    };
  };

  public type Progress = {
    sessionCount : Nat;
    averageConfidence : Float;
    allSessions : [Session];
  };

  public type UserProfile = {
    name : Text;
  };

  let scenarios = List.fromArray<Scenario>([
    { title = "Job Interview"; prompt = "You're interviewing for a software developer position. I'll play the interviewer." },
    { title = "Networking";
      prompt = "You're at a networking event. Let's practice introducing yourself. I will play a new industry contact.";
    },
    { title = "Presentation";
      prompt = "You're giving a presentation to a team. I will act as the audience.";
    },
    { title = "Negotiation"; prompt = "You're entering a salary negotiation. I will play your manager." },
    { title = "Speech Anxiety"; prompt = "You're giving a speech and feeling nervous. I will act as the supportive audience." },
  ]);

  let sessions = Map.empty<Text, Session>();
  let analysisSummaries = Map.empty<Text, Text>();
  let sessionOwners = Map.empty<Text, Principal>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getScenarios() : async [Scenario] {
    scenarios.toArray().sort();
  };

  public query ({ caller }) func getSessionSummaries() : async { messages : Nat; summaries : Nat } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view session summaries");
    };

    let userSessions = sessions.values().toArray().filter(func(s : Session) : Bool {
      switch (sessionOwners.get(s.id)) {
        case (?owner) { owner == caller };
        case (null) { false };
      };
    });

    let userSummaries = analysisSummaries.toArray().filter(func(entry : (Text, Text)) : Bool {
      let (sessionId, _) = entry;
      switch (sessionOwners.get(sessionId)) {
        case (?owner) { owner == caller };
        case (null) { false };
      };
    });

    {
      messages = userSessions.size();
      summaries = userSummaries.size();
    };
  };

  func analyzeMessageContent(content : Text) : Float {
    let lengthScore = (content.size().toFloat() * 0.8 + 20.0) / 100.0;
    let errorPenalty = if (content.contains(#text "uh") or content.contains(#text "um")) { 0.2 } else { 0.0 };
    let repeatedWordPenalty = if (content.contains(#text "like")) { 0.1 } else { 0.0 };

    let confidence = lengthScore - errorPenalty - repeatedWordPenalty;
    if (confidence < 0.0) { 0.0 } else if (confidence > 1.0) { 1.0 } else { confidence };
  };

  public query ({ caller }) func getSessionHistory() : async [Session] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view session history");
    };

    sessions.values().toArray().filter(func(s : Session) : Bool {
      switch (sessionOwners.get(s.id)) {
        case (?owner) { owner == caller };
        case (null) { false };
      };
    }).sort();
  };

  public query ({ caller }) func getAnalysisSummaries() : async [(Text, Text)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view analysis summaries");
    };

    analysisSummaries.toArray().filter(func(entry : (Text, Text)) : Bool {
      let (sessionId, _) = entry;
      switch (sessionOwners.get(sessionId)) {
        case (?owner) { owner == caller };
        case (null) { false };
      };
    });
  };

  public query ({ caller }) func getProgressStats() : async Progress {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view progress stats");
    };

    let userSessions = sessions.values().toArray().filter(func(s : Session) : Bool {
      switch (sessionOwners.get(s.id)) {
        case (?owner) { owner == caller };
        case (null) { false };
      };
    }).sort();

    let totalConfidence = userSessions.values().foldLeft(0.0, func(acc, s) { acc + s.confidenceScores.foldLeft(0.0, func(confAcc, curr) { confAcc + curr }) });
    let totalMessages = userSessions.values().foldLeft(0, func(acc, s) { acc + s.messages.size() });

    let average = if (totalMessages > 0) { totalConfidence / totalMessages.toFloat() } else { 0.0 };

    {
      sessionCount = userSessions.size();
      averageConfidence = average;
      allSessions = userSessions;
    };
  };

  public shared ({ caller }) func createSession(scenario : Scenario) : async Session {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create sessions");
    };

    let sessionId = scenario.title.concat(Time.now().toText() : Text);
    let newSession = {
      id = sessionId;
      scenario;
      startTime = Time.now();
      endTime = null;
      messages = [];
      confidenceScores = [];
      analysisSummary = "";
    };

    sessions.add(sessionId, newSession);
    sessionOwners.add(sessionId, caller);
    newSession;
  };

  public shared ({ caller }) func addMessage(sessionId : Text, sender : Text, content : Text) : async Session {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add messages");
    };

    switch (sessions.get(sessionId)) {
      case (null) { Runtime.trap("Session not found") };
      case (?session) {
        if (not isAuthor(caller, sessionId)) { Runtime.trap("Session not found or unauthorized") };

        let message = {
          sender;
          content;
          time = Time.now();
        };

        let updatedMessages = session.messages.concat([message]);
        let confidenceScore = analyzeMessageContent(content);
        let updatedConfidenceScores = session.confidenceScores.concat([confidenceScore]);
        let updatedSession = {
          session with
          messages = updatedMessages;
          confidenceScores = updatedConfidenceScores;
        };

        sessions.add(sessionId, updatedSession);
        updatedSession;
      };
    };
  };

  public shared ({ caller }) func endSession(sessionId : Text, summary : Text) : async Session {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can end sessions");
    };
    if (not isAuthor(caller, sessionId)) { Runtime.trap("Session not found or unauthorized") };

    switch (sessions.get(sessionId)) {
      case (null) { Runtime.trap("Session not found") };
      case (?session) {
        let completedSession = {
          session with
          endTime = ?Time.now();
        };
        analysisSummaries.add(sessionId, summary);
        sessions.add(sessionId, completedSession);
        completedSession;
      };
    };
  };

  public query ({ caller }) func getUserSessions() : async [Session] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view sessions");
    };

    sessions.values().toArray().filter(func(s : Session) : Bool {
      switch (sessionOwners.get(s.id)) {
        case (?owner) { owner == caller };
        case (null) { false };
      };
    }).sort();
  };

  func isAuthor(caller : Principal, sessionId : Text) : Bool {
    switch (sessionOwners.get(sessionId)) {
      case (?owner) { caller == owner };
      case (null) { false };
    };
  };

  public query ({ caller }) func getSessionOwner(sessionId : Text) : async Principal {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can query session ownership");
    };

    switch (sessionOwners.get(sessionId)) {
      case (?owner) {
        if (caller != owner and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view ownership of your own sessions");
        };
        owner;
      };
      case (null) { Runtime.trap("Session not found") };
    };
  };

  public shared ({ caller }) func clearSessions() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    sessions.clear();
    analysisSummaries.clear();
    sessionOwners.clear();
  };
};
