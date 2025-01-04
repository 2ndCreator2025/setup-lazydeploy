// main.ts
import { getInput, setOutput, setFailed } from "https://deno.land/x/actions/mod.ts";

async function run() {
    try {
        // Get inputs from the action
        const pipeline = getInput('pipeline');
        const args = getInput('args');
        const workingDirectory = getInput('working-directory');

        // Log the inputs for debugging
        console.log(`Running ${pipeline} with args: ${args} in ${workingDirectory}`);

        // Example: Execute a command using Deno.run
        const process = Deno.run({
            cmd: [pipeline, ...args.split(" ")], // Split args into an array
            cwd: workingDirectory, // Set the working directory
            stdout: "piped", // Pipe the output
            stderr: "piped", // Pipe the error output
        });

        // Capture the output and error
        const [status, stdout, stderr] = await Promise.all([
            process.status(),
            process.output(),
            process.stderrOutput(),
        ]);

        // Decode the output
        const output = new TextDecoder().decode(stdout);
        const errorOutput = new TextDecoder().decode(stderr);

        // Log the output
        console.log(`Output: ${output}`);
        if (errorOutput) {
            console.error(`Error Output: ${errorOutput}`);
        }

        // Set the output of the action
        setOutput("result", `Executed ${pipeline} with args: ${args}`);

        // Check if the process exited successfully
        if (!status.success) {
            throw new Error(`Process failed with exit code ${status.code}`);
        }
    } catch (error) {
        setFailed(error.message);
    }
}

// Run the main function
run();