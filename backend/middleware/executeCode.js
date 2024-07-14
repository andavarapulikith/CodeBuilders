function executeCode(command, inputFilePath, tempCodeFilePath, res) {
    const options = inputFilePath
      ? { input: fs.readFileSync(inputFilePath) }
      : {};
    const childProcess = exec(command, options, (error, stdout, stderr) => {
      if (fs.existsSync(tempCodeFilePath)) fs.unlinkSync(tempCodeFilePath);
      if (
        command.includes(".out") &&
        fs.existsSync(path.join(__dirname, "main.out"))
      ) {
        fs.unlinkSync(path.join(__dirname, "main.out"));
      } else if (
        command.includes("java") &&
        fs.existsSync(tempCodeFilePath.replace(".java", ".class"))
      ) {
        fs.unlinkSync(tempCodeFilePath.replace(".java", ".class"));
      }
      if (inputFilePath && fs.existsSync(inputFilePath))
        fs.unlinkSync(inputFilePath);
  
      if (error) {
        res.json({ output: null, error: stderr });
      } else {
        res.json({ output: stdout, error: stderr });
      }
    });
  
    if (options.input) {
      childProcess.stdin.write(options.input);
      childProcess.stdin.end();
    }
  }
  module.exports=executeCode;