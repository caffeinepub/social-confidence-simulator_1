import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Progress {
    allSessions: Array<Session>;
    averageConfidence: number;
    sessionCount: bigint;
}
export interface Session {
    id: string;
    startTime: bigint;
    analysisSummary: string;
    endTime?: bigint;
    messages: Array<Message>;
    scenario: Scenario;
    confidenceScores: Array<number>;
}
export interface Message {
    content: string;
    time: bigint;
    sender: string;
}
export interface UserProfile {
    name: string;
}
export interface Scenario {
    title: string;
    prompt: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMessage(sessionId: string, sender: string, content: string): Promise<Session>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearSessions(): Promise<void>;
    createSession(scenario: Scenario): Promise<Session>;
    endSession(sessionId: string, summary: string): Promise<Session>;
    getAnalysisSummaries(): Promise<Array<[string, string]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProgressStats(): Promise<Progress>;
    getScenarios(): Promise<Array<Scenario>>;
    getSessionHistory(): Promise<Array<Session>>;
    getSessionOwner(sessionId: string): Promise<Principal>;
    getSessionSummaries(): Promise<{
        messages: bigint;
        summaries: bigint;
    }>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserSessions(): Promise<Array<Session>>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
