// import React from 'react';

// const HomePage = () => {
//     return (
//         <div className="bg-gray-100 min-h-screen">
//             <header className="bg-blue-500 py-8">
//                 <div className="container mx-auto flex justify-between items-center">
//                     <h1 className="text-white text-3xl font-bold">OnlineJudgeX</h1>
//                     <div>
//                         <button className="bg-white text-blue-500 font-semibold py-2 px-6 rounded-full mr-4">Sign Up</button>
//                         <button className="bg-transparent text-white border border-white font-semibold py-2 px-6 rounded-full">Login</button>
//                     </div>
//                 </div>
//             </header>

//             <section className="container mx-auto py-12">
//                 <div className="text-center">
//                     <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome to OnlineJudgeX</h2>
//                     <p className="text-lg text-gray-600 mb-8">Empower Your Code, Sharpen Your Skills</p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                     <div className="bg-white rounded-lg shadow-lg p-6">
//                         <h3 className="text-xl font-semibold mb-4">Challenge Yourself</h3>
//                         <p>Solve coding problems from various domains and enhance your problem-solving abilities.</p>
//                     </div>
//                     <div className="bg-white rounded-lg shadow-lg p-6">
//                         <h3 className="text-xl font-semibold mb-4">Compete Globally</h3>
//                         <p>Participate in coding contests and measure your skills against programmers from around the world.</p>
//                     </div>
//                     <div className="bg-white rounded-lg shadow-lg p-6">
//                         <h3 className="text-xl font-semibold mb-4">Track Your Progress</h3>
//                         <p>Monitor your progress, analyze your submissions, and improve continuously.</p>
//                     </div>
//                 </div>

//                 <div className="text-center mt-8">
//                     <button className="bg-blue-500 text-white font-semibold py-2 px-8 rounded-full">Sign Up Now</button>
//                 </div>
//             </section>

//             <section className="bg-gray-800 text-white py-12">
//                 <div className="container mx-auto text-center">
//                     <h2 className="text-4xl font-bold mb-4">Featured Contests</h2>
//                     <p className="text-lg mb-8">Join the Latest Coding Battles</p>
//                     {/* Featured contests component */}
//                 </div>
//             </section>

//             <section className="container mx-auto py-12">
//                 <div className="text-center">
//                     <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose OnlineJudgeX?</h2>
//                     <p className="text-lg text-gray-600 mb-8">See What Our Coders Have to Say</p>
//                 </div>
//                 {/* Testimonials component */}
//             </section>

//             <section className="bg-gray-800 text-white py-12">
//                 <div className="container mx-auto text-center">
//                     <h2 className="text-4xl font-bold mb-4">Latest Blog Posts</h2>
//                     <p className="text-lg mb-8">Stay Updated with Our Coding Insights</p>
//                     {/* Latest blog posts component */}
//                 </div>
//             </section>

//             <footer className="bg-blue-500 text-white py-8 text-center">
//                 <ul>
//                     <li className="inline-block mr-6"><a href="#">About Us</a></li>
//                     <li className="inline-block mr-6"><a href="#">FAQs</a></li>
//                     <li className="inline-block mr-6"><a href="#">Contact Us</a></li>
//                     <li className="inline-block mr-6"><a href="#">Terms of Service</a></li>
//                     <li className="inline-block"><a href="#">Privacy Policy</a></li>
//                 </ul>
//             </footer>
//         </div>
//     );
// }

// export default HomePage;
import React from 'react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Transparent Navbar */}
      <header className="fixed top-0 left-0 w-full bg-transparent text-white py-4 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Code Builders</h1>
          <nav>
            <a href="#login" className="mx-2">Login</a>
            <a href="#signup" className="mx-2">Sign Up</a>
            <a href="#problems" className="mx-2">Problems</a>
            <a href="#leaderboard" className="mx-2">Leaderboard</a>
            <a href="#profile" className="mx-2">Profile</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-500 text-white py-32 text-center">
        <div className="container mx-auto pt-16">
          <h2 className="text-4xl font-bold mb-4">Welcome to Code Builders</h2>
          <p className="text-xl mb-8">Solve coding problems, view solutions, and track your progress on leaderboards.</p>
          <a href="#signup" className="bg-white text-blue-800 py-2 px-4 rounded">Get Started</a>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-16">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-8 text-center">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex">
              <img src="https://via.placeholder.com/400" alt="Feature 1" className="w-1/2 rounded-l-md" />
              <div className="w-1/2 bg-white p-6 rounded-r-md flex flex-col justify-center">
                <h4 className="text-2xl font-bold mb-4">Login</h4>
                <p>Log in to your account to access coding problems and track your progress.</p>
              </div>
            </div>
            <div className="flex flex-row-reverse">
              <img src="https://via.placeholder.com/400" alt="Feature 2" className="w-1/2 rounded-r-md" />
              <div className="w-1/2 bg-white p-6 rounded-l-md flex flex-col justify-center">
                <h4 className="text-2xl font-bold mb-4">Sign Up</h4>
                <p>Create a new account to start solving problems and climb the leaderboards.</p>
              </div>
            </div>
            <div className="flex">
              <img src="https://via.placeholder.com/400" alt="Feature 3" className="w-1/2 rounded-l-md" />
              <div className="w-1/2 bg-white p-6 rounded-r-md flex flex-col justify-center">
                <h4 className="text-2xl font-bold mb-4">Problems</h4>
                <p>Access a wide range of coding problems with various difficulty levels.</p>
              </div>
            </div>
            <div className="flex flex-row-reverse">
              <img src="https://via.placeholder.com/400" alt="Feature 4" className="w-1/2 rounded-r-md" />
              <div className="w-1/2 bg-white p-6 rounded-l-md flex flex-col justify-center">
                <h4 className="text-2xl font-bold mb-4">Problem Details</h4>
                <p>View problem statements, sample test cases, and submit your solutions.</p>
              </div>
            </div>
            <div className="flex">
              <img src="https://via.placeholder.com/400" alt="Feature 5" className="w-1/2 rounded-l-md" />
              <div className="w-1/2 bg-white p-6 rounded-r-md flex flex-col justify-center">
                <h4 className="text-2xl font-bold mb-4">Leaderboard</h4>
                <p>Track your ranking and see how you compare with other users.</p>
              </div>
            </div>
            <div className="flex flex-row-reverse">
              <img src="https://via.placeholder.com/400" alt="Feature 6" className="w-1/2 rounded-r-md" />
              <div className="w-1/2 bg-white p-6 rounded-l-md flex flex-col justify-center">
                <h4 className="text-2xl font-bold mb-4">User Profile</h4>
                <p>View and edit your profile, see solved problems and performance stats.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gray-200 py-16 text-center">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-8">Join Our Community</h3>
          <p className="text-xl mb-8">Start solving problems, improve your skills, and join a community of passionate coders.</p>
          <a href="#signup" className="bg-blue-800 text-white py-2 px-4 rounded">Sign Up Now</a>
        </div>
      </section>

      {/* Interesting Reads Section */}
      <section className="py-16">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-8">Interesting Reads</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded shadow">
              <h4 className="text-2xl font-bold mb-4">2024 General Election</h4>
              <p>Make sure you're ready to cast your vote with these tips and guidelines.</p>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <h4 className="text-2xl font-bold mb-4">Election Promises</h4>
              <p>Find out where the parties stand on supporting veterans and their families.</p>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <h4 className="text-2xl font-bold mb-4">Campaign Updates</h4>
              <p>Get the latest news on our campaign and how you can get involved.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-800 text-white py-8">
        <div className="container mx-auto text-center">
          <div className="mb-4">
            <h3 className="text-xl font-bold">Stay Connected</h3>
            <div className="flex justify-center space-x-4">
              <a href="#" className="hover:text-gray-300">Facebook</a>
              <a href="#" className="hover:text-gray-300">Twitter</a>
              <a href="#" className="hover:text-gray-300">LinkedIn</a>
              <a href="#" className="hover:text-gray-300">Instagram</a>
            </div>
          </div>
          <p>&copy; 2024 Code Builders. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
