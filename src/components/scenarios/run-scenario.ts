export const runScenario = async (scenario: AsyncGenerator): Promise<unknown> => {
  // Initialize the scenario
  let result = await scenario.next();

  try {
    while (!result.done) {
      // Move to next step
      result = await scenario.next(result.value);
    }
  } catch (error) {
    console.log('Scenario interrupted:', error);
  }

  // Finalize the scenario
  return result.value;
};
