// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { authStore } from '../stores/authStore';


// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     await authStore.login(email, password);
//     navigate('/dashboard');
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-purple-100">
//       <form onSubmit={handleLogin} className="bg-pink-200 p-8 rounded-lg shadow-md w-full max-w-sm">
//         <h2 className="text-2xl font-bold text-purple-800 mb-6 text-center">Username</h2>
//         <input
//           type="text"
//           placeholder="Username"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full p-2 mb-4 border border-purple-300 rounded"
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-2 mb-4 border border-purple-300 rounded"
//         />
//         <button type="submit" className="w-full p-2 bg-purple-500 text-white rounded hover:bg-purple-600">
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default LoginPage;

