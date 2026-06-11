const ResumeModel = require('../Models/resume');
const pdfParse = require('pdf-parse');
const { CohereClient } = require("cohere-ai");


const cohere = new CohereClient({
    token: process.env.token
});


exports.addResume = async (req, res) => {
    try {
        const { job_desc, user } = req.body;
        const pdfBuffer = req.file.buffer || null;
        const pdfPath = req.file.path || null;
        const fs = require('fs');
        const dataBuffer = fs.readFileSync(pdfPath);
        const pdfData = await pdfParse(dataBuffer);
        // console.log(pdfData);

        const prompt = `
            You are a resume screening assistant.
            Compare the following resume text with the provided Job Description (JD) and give a match score (0-100) and feedback.

            Resume:
            ${pdfData.text}

            Job Description:
            ${job_desc}

            Return the score and a brief explanation in this format:
            Score: XX
            Reason: ...

            `
            ;

        const response = await cohere.chat({
            model: "command-a-03-2025",
            message: prompt,
            temperature: 0.7,
        });

        let result = response.text;

        result = result.replace(/\*\*/g, '');

        const match = result.match(/Score:\s*(\d+)/);

        const score = match ? parseInt(match[1]) : null;

        const reasonMatch = result.match(/Reason:\s*(.*)/s);

        const reason = reasonMatch
            ? reasonMatch[1].trim()
            : null;

        // console.log(score);

        // console.log(reason);

        const newResume = new ResumeModel({
            user,
            resume_name: req.file.originalname,
            job_desc,
            score,
            feedback: reason
        });

        await newResume.save();
        fs.unlinkSync(pdfPath);
        res.status(200).json({ message: 'Your analysis are ready', data: newResume });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error', message: err.message });
    }
}

exports.getAllResumesForUser = async (req, res) => {
    try {
        const { user } = req.params;
        let resumes = await ResumeModel.find({ user }).sort({ createdAt: -1 });
        return res.status(200).json({ message: "Your Previous History", resumes: resumes });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Server Error', message: err.message });
    }
}


exports.getResumeForAdmin = async (req, res) => {
    try {
        let resumes = await ResumeModel.find().sort({ createdAt: -1 }).populate('user');
        return res.status(200).json({ message: "Fetched All resume", resumes: resumes });
    } catch (err) {
        return res.status(500).json({ message: 'Server Error', message: err.message });
    }
}