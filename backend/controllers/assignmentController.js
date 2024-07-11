const Assignment = require("../models/assignment_model");

const CreateAssignment = async (req, res) => {
  const { title, problems } = req.body;

  try {
    const newAssignment = new Assignment({
      title,
      problems,
    });

    const assignment = await newAssignment.save();

    res.json(assignment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().populate("problems", "title"); // Populating problem titles
    res.json(assignments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate(
      "problems"
    );
    if (!assignment) {
      return res.status(404).json({ msg: "Assignment not found" });
    }
    res.json(assignment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Assignment not found" });
    }
    res.status(500).send("Server Error");
  }
};

module.exports = { CreateAssignment, getAllAssignments, getAssignmentById };
