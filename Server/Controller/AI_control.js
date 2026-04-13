import axios from 'axios';
import dotenv from 'dotenv';
import Task from '../Models/task.js';

dotenv.config();

export const getAlldata = async(req, res) => {

    try {
        
        const tasks = await Task.findAll({
            order: [['createdAt', 'DESC']]
        })

        res.json({ success: true, data: tasks})
    } catch (error) {
        res.status(500).json({ success: false, message: "Cache error, Not working!"})
    }
};

export const Removedata = async (req, res) => {
    try {
        
        const {id} = req.params;
        await Task.destroy({where: {id: id}})
        res.json({ success: true, message: "Deleted successful"})
    } catch (error) {
        res.status(500).json({ success: false, message: "Cache error, not working!"})
    }
}

export const Updatedata = async(req, res) => {
    try {
        
        const{ id } = req.params;
        const task = await Task.findByPk(id);

        const newstatus = task?.status === 'Pending' ? 'Completed' : 'Pending'
        await task?.update({status: newstatus})
        
        res.json({ success: true, message: `Task Marked as ${newstatus}`})
    } catch (error) {
        res.status(500).json({ success: false, message: "cache error, server did not respond"})
    }
}

export const Analyzetask = async(req, res) => {
    
    try {
        
        const {title} = req.body;
        
        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions",{
            model: "openai/gpt-oss-120b:free",
            messages: [
                {
                    role: "system",
                    content: "You are a professional project manager. Provide task breakdowns in a strict JSON array format."
                },
                {
                    role: "user",
                    content: `Break this task into 3-5 actionable steps: "${title}". Return ONLY a JSON array of strings.`
                }
            ]
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": `${process.env.VITE_URL}`,
                "X-Title": "AI Task App"
            }
        }
    );

    const AIresopnse = response.data.choices[0].message.content;
    const cleaningJson = AIresopnse.replace(/```json|```/g, "").trim();
    const Forward = JSON.parse(cleaningJson);

    const newTask = await Task.create({
        title: title,
        ai_steps: Forward,
        status: 'Pending'
    })

    res.json({
        success: true,
        message: "Task analyzed and saved",
        data: newTask
    })

    } catch (error) {
       console.log("AI failed", error.response?.data || error.message);
       res.status(500).json({success: false, message: "Ai is not working Properly"})
        
    }
};

