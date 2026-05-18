# Security Specification for Momentum Habit Tracker

## 1. Data Invariants
- A **User** profile must correspond to the authenticated user ID.
- A **Habit** must belong to exactly one user.
- A **HabitCompletion** must belong to a valid Habit owned by the user.
- Timestamps (`createdAt`, `updatedAt`, `completedAt`) must use server time.
- All IDs must be correctly formatted and sized.

## 2. The "Dirty Dozen" Payloads (Red Team Audit)

### Attack 1: User Profile Hijacking
- **Payload**: `{ "id": "ATTACKER_ID", "data": { "email": "victim@example.com", "xp": 99999 } }`
- **Goal**: Create a profile for another user or spoof XP.
- **Expected**: PERMISSION_DENIED (Identity Guard).

### Attack 2: Shadow Field Injection
- **Payload**: `{ "title": "Run", "userId": "MY_ID", "isAdmin": true }`
- **Goal**: Inject an undocumented field to gain privileges.
- **Expected**: PERMISSION_DENIED (Strict Key Count).

### Attack 3: Orphaned Completion
- **Payload**: `{ "habitId": "NON_EXISTENT_HABIT", "userId": "MY_ID", "status": "completed" }`
- **Goal**: Create data disconnected from a parent resource.
- **Expected**: PERMISSION_DENIED (Parent Existential Check).

### Attack 4: Timestamp Spoofing
- **Payload**: `{ "createdAt": "2020-01-01T00:00:00Z" }`
- **Goal**: Backdate records.
- **Expected**: PERMISSION_DENIED (Server Timestamp Enforcement).

### Attack 5: Resource Poisoning (ID)
- **Payload**: `PUT /habits/VERY_LONG_JUNK_STRING_1024_CHARS`
- **Goal**: Resource exhaustion.
- **Expected**: PERMISSION_DENIED (ID Regex & Size Guard).

### Attack 6: Unverified Access
- **Payload**: Authenticated but `email_verified: false` attempting a write.
- **Goal**: Bypass verification.
- **Expected**: PERMISSION_DENIED (Verification Requirement).

### Attack 7: Habit Stealing (Update)
- **Payload**: Update `userId` of a habit to own it.
- **Goal**: Take over another's habit.
- **Expected**: PERMISSION_DENIED (Immutability Gate).

### Attack 8: Completion Date Manipulation
- **Payload**: Update `date` of a completion.
- **Goal**: Change history.
- **Expected**: PERMISSION_DENIED (Immutability Gate).

### Attack 9: Mass List Scrape
- **Payload**: `getDocs(collection(db, 'habits'))` without filters.
- **Goal**: See others' habits.
- **Expected**: PERMISSION_DENIED (List Rule Resource Check).

### Attack 10: Type Poisoning
- **Payload**: `{ "xp": "level_99" }` (String instead of Number).
- **Goal**: Crash calculations.
- **Expected**: PERMISSION_DENIED (Type Safety helper).

### Attack 11: PII Scrape
- **Payload**: `getDoc(doc(db, 'users', 'VICTIM_ID'))`.
- **Goal**: Read private emails.
- **Expected**: PERMISSION_DENIED (Owner-only Read).

### Attack 12: Frequency Attack
- **Payload**: Rapidly updating XP.
- **Goal**: Game system (handled by backend usually, but rules check `updatedAt == request.time`).
- **Expected**: Success only if timestamps match server frequency.

## 3. Test Runner (Draft Logic)
The `firestore.rules.test.ts` would verify these 12 scenarios using `firebase-sdk/rules-unit-testing`.
