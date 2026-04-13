import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, {Toaster} from 'react-hot-toast'

const App = () => {
  const [taskTitle, setTaskTitle] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Fetch all tasks from Backend
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`https://ai-task-manager-2ewx.onrender.com/api/task/all`);
      setTasks(res.data.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 2. Analyze Task with AI
  const handleAnalyze = async (e) => {
    e.preventDefault();
    // Safety Check: Title khali na ho aur loading pehle se na chal rahi ho
    if (!taskTitle.trim() || loading) return;

    setLoading(true);
    const ToastId = toast.loading("AI is Thinking, Please wait for a while 😅!")
    try {
      await axios.post(`https://ai-task-manager-2ewx.onrender.com/api/task/analyze`, { title: taskTitle });
      setTaskTitle(''); // Input khali karo
      await fetchTasks(); // List refresh karo
      toast.success("Task Breakdown Ready 👍", {id: ToastId})
    } catch (err) {
      toast.error("AI is confused", {id: ToastId})
      console.error(err);
    } finally {
      setLoading(false); // Button ko wapas normal karo
    }
  };

  const handleUpdate = async (id) => {
    try {
      
      await axios.put(`https://ai-task-manager-2ewx.onrender.com/api/task/${id}`)
      fetchTasks();
      toast.success("Task Updated ✅")
    } catch (error) {
      toast.error("Update Failed!")
    }
  }

  // 3. Delete Task
  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this?")) return;
    try {
      await axios.delete(`https://ai-task-manager-2ewx.onrender.com/api/task/${id}`);
      fetchTasks();
      toast.success("Status Deleted ✅")
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-12 selection:bg-blue-500/30">
      <Toaster position='top-center' reverseOrder={false} />

      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <header className="text-center mb-16">
          <h1 className="text-6xl font-black tracking-tighter bg-clip-text bg-linear-to-r from-blue-400 to-purple-500 mb-4">
            Task Master <span className='text-blue-500 text-3xl italic'>AI</span>
          </h1>
          <div className='h-1 w-24 bg-blue-600 mx-auto rounded-full'></div>
        </header>

        {/* Input Form Section */}
        <form onSubmit={handleAnalyze} className="relative group mb-20">
          <input
            type="text"
            className="w-full p-6 pr-44 rounded-2xl bg-gray-800 border-2 border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg shadow-2xl"
            placeholder="What's your next big goal ?"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className={`absolute right-3 top-3 bottom-3 bg-blue-600 hover:bg-blue-700 px-6 rounded-xl font-bold transition-all disabled:grayscale`}
          >
            {loading ? "Processing..." : "Get Plan"}
          </button>
        </form>

        {/* Tasks Grid */}
        <div className="grid gap-10">
          {tasks.map((task) => (
            <div key={task.id} 
            className={`relative overflow-hidden transition-all duration-500 rounded-3xl border-2 ${task.status === "Completed" ? 'bg-gray-900/40 border-green-900/30 opacity-60' : 'bg-gray-900 border-gray-900 hover:bg-gray-700'}`}>

              <div className='p-8'>
                <div className='flex justify-between items-center mb-8'>
                  <h3 className={`text-2xl font-bold ${task.status === "Completed" ? 'line-through text-gray-500' : 'text-white'}`}>
                    {task.title}
                  </h3>

                  <div className='flex gap-3'>
                    <button 
                    onClick={()  => handleUpdate(task.id)}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${task.status === "Completed" ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                      {task.status}
                    </button>

                    <button onClick={() => handleDelete(task.id)}
                      className='p-2 text-gray-600 hover:bg-red-500 transition-colors'>
                        <svg xmlns="http://www.w3.org/2000/svg" className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /> 
                        </svg>
                      </button>

                  </div>
                </div>

                <div className='space-y-4'>
                  {task.ai_steps.map((step, i) => (
                    <div key={i} className='flex gap-4 items-center group/item'>
                      <div className='h-2 w-2 rounded-full bg-blue-600 group-hover/item:scale-150 transition-transform'></div>
                      <p className='text-gray-400 text-lg group-hover/item:text-gray-200 transition-colors'>{step}</p>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          ))}
     
        </div>

                
      </div>
    </div>
  );
};

export default App;