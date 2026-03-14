NEVER simplify or remove test scenarios to make tests pass. When tests fail, fix the actual implementation.

✅ Updating mock data to reflect new business rules
✅ Adjusting expected values after implementation changes
✅ Adding missing mocks or dependencies
❌ Removing assertions that check error conditions
❌ Changing test expectations to match broken implementation
❌ Commenting out failing test cases

Tests are documentation of how the system should behave.