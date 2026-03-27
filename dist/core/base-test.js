"use strict";
// File: src/core/base-test.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipTestError = void 0;
exports.makeResult = makeResult;
// Your existing classes and types
class SkipTestError extends Error {
}
exports.SkipTestError = SkipTestError;
// Utility to create TestResult
function makeResult(test, status, startedAt, endedAt, attempt, artifacts, errorMessage) {
    return {
        id: test.id,
        name: test.name,
        suite: test.suite,
        status,
        startedAt,
        endedAt,
        attempt,
        artifacts,
        errorMessage
    };
}
