import React from "react";
import codingimage from "../coding.jpg";
import leaderboardimage from "../leaderboard.png";
import codingsectionimage from "../codingsection.jpg";
import blog1image from "../blog1.png";
import blog2image from "../blog2.jpg";
import blog3image from "../blog3.jpg";
import contactusimage from '../contactus.jpg'
import { AuthContext } from "../providers/authProvider";
import { useContext } from "react";
import { Link } from "react-router-dom";
const Home = () => {
  var isloggedin=false;
  
  const authData=useContext(AuthContext);
  if(authData.authData != null)
    isloggedin=true;
  
  console.log(isloggedin)
  return (
    <div>
      {/* Navbar */}
      <nav className="bg-transparent text-yellow-600 fixed w-full z-10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-yellow-600">
            Codebuilders
          </Link>
          <ul className="flex space-x-4">
            <li>
              <Link to='/' className="hover:text-yellow-300">
                Home
              </Link>
            </li>
            <li>
              <Link to={isloggedin?'/allproblems':'/login'} className="hover:text-yellow-300">
                All Questions
              </Link>
            </li>
            <li>
              <Link to={isloggedin?'/leaderboard':'/login'} className="hover:text-yellow-300">
                Leaderboard
              </Link>
            </li>
            <li>
            <Link to="/texteditor" className="hover:text-yellow-300">
                               TextEditor
                            </Link>
            </li>
            <li>
                <Link to="/ide" className="hover:text-yellow-300">
                    Online IDE
                </Link>
            </li>
            
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gray-100 pt-20 md:pt-32 pb-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2">
            <img src={codingimage} alt="Hero Image" className="rounded-lg shadow-lg" />
          </div>
          <div className="md:w-1/2 md:ml-10 mt-10 md:mt-0">
            <h1 className="text-4xl font-bold text-yellow-700">
              Welcome to Codebuilders
            </h1>
            <p className="mt-4 text-yellow-900">
              Codebuilders is your ultimate online judge platform. Compete in
              coding challenges, enhance your problem-solving skills, and climb
              the leaderboard. Join our community of passionate developers and
              take your coding skills to the next level.
            </p>
            <Link to={isloggedin?'/allproblems':'/login'} >
            <button className="mt-6 px-6 py-2 bg-yellow-900 text-white rounded-lg shadow-lg hover:bg-dark-yellow-700">
              Get Started
            </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-200 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-yellow-800 mb-8">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: Problems */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold text-yellow-800 mb-4">
                Problems
              </h3>
              <p className="text-gray-600">
                Access a wide range of coding problems to practice and improve
                your skills.
              </p>
            </div>
            {/* Feature 2: Leaderboard */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold text-yellow-800 mb-4">
                Leaderboard
              </h3>
              <p className="text-gray-600">
                Compete with others and see where you stand on our leaderboard.
              </p>
            </div>
            {/* Feature 3: User Stats */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold text-yellow-800 mb-4">
                User Stats
              </h3>
              <p className="text-gray-600">
                Track your progress and performance with detailed user stats.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Community Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Join Our Community
          </h2>
          <p className="text-gray-600">
            Start solving problems, improve your skills, and join a community of
            passionate coders.
          </p>
          <Link to='/signup'>
          <button className="mt-6 px-6 py-2 bg-yellow-600 text-white rounded-lg shadow-lg hover:bg-yellow-700">
            Join Now
          </button>
          </Link>
        </div>
      </section>
      <section class="bg-gray-200 py-20">
        <div class="container mx-auto px-6">
          <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">
            Resources
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-4">
                Coding Tutorials and Courses
              </h3>
              <p class="text-gray-600">
                Discover a variety of coding tutorials, courses, and learning
                paths tailored to different skill levels and programming
                languages.
              </p>
            </div>

            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-4">
                Career Development Guides
              </h3>
              <p class="text-gray-600">
                Access insightful guides and articles on resume building,
                interview preparation, career advancement, and freelancing tips.
              </p>
            </div>

            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-4">
                Online Communities
              </h3>
              <p class="text-gray-600">
                Join vibrant online communities and forums where you can connect
                with other developers, ask questions, share knowledge, and
                collaborate on projects.
              </p>
            </div>

            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-4">
                Recommended Tools and Software
              </h3>
              <p class="text-gray-600">
                Find a list of recommended tools, software, and resources to
                streamline your development workflow, improve productivity, and
                enhance your coding experience.
              </p>
            </div>

            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-4">
                Coding Challenges Platforms
              </h3>
              <p class="text-gray-600">
                Explore platforms offering coding challenges and competitions to
                practice coding skills, solve real-world problems, and enhance
                your problem-solving abilities.
              </p>
            </div>

            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-4">
                Tech Events and Webinars
              </h3>
              <p class="text-gray-600">
                Stay updated on upcoming tech events, conferences, and webinars
                to expand your knowledge, network with industry professionals,
                and stay abreast of the latest trends and technologies.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Leaderboard Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <img
              src={leaderboardimage}
              alt="Leaderboard"
              className="rounded-lg shadow-lg"
              style={{ maxHeight: "300px", width: "500px" }}
            />
          </div>
          <div className="md:w-1/2 md:ml-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Leaderboard
            </h2>
            <p className="text-gray-600 mb-4">
              Compete with others and see where you stand on our leaderboard.
              Top performers get recognition and rewards!
            </p>
            <p className="text-gray-600">
              Join our community now and start climbing up the ranks.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 order-first md:order-last">
            <img
              src={codingsectionimage}
              alt="All Problems"
              className="rounded-lg shadow-lg"
              style={{ maxHeight: "300px", width: "600px" }}
            />
          </div>
          <div className="md:w-1/2 md:ml-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Solve Problems
            </h2>
            <p className="text-gray-600 mb-4 mr-2">
              Access a wide range of coding problems covering various topics and
              difficulty levels. Whether you're a beginner or an experienced
              coder, our platform offers challenges tailored to your skill
              level.
            </p>
            <p className="text-gray-600">
              Join our community now and start solving challenges.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-gray-200 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Latest Blogs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Blog 1 */}
            <div className="bg-white rounded-lg shadow-md">
              <img
                src={blog1image}
                alt="Blog 1"
                className="rounded-t-lg w-full h-50 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {" "}
                  The Role of Soft Skills in Technical Interviews
                </h3>
                <p className="text-gray-600 mb-4">
                  Soft skills are crucial in technical interviews, often as
                  important as technical knowledge. Adaptability ensures you
                  stay relevant in a dynamic industry.
                </p>
                <a href="#" className="text-yellow-600 hover:underline">
                  Read More
                </a>
              </div>
            </div>
            {/* Blog 2 */}
            <div className="bg-white rounded-lg shadow-md">
              <img
                src={blog2image}
                alt="Blog 2"
                className="rounded-t-lg w-full h-50 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {" "}
                  Essential Skills of a Competitive Programmer
                </h3>
                <p className="text-gray-600 mb-4">
                  A competitive programmer must possess strong problem-solving
                  abilities, capable of breaking down complex problems into
                  manageable chunks.{" "}
                </p>
                <a href="#" className="text-yellow-600 hover:underline">
                  Read More
                </a>
              </div>
            </div>
            {/* Blog 3 */}
            <div className="bg-white rounded-lg shadow-md">
              <img
                src={blog3image}
                alt="Blog 3"
                className="rounded-t-lg w-full h-50 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {" "}
                  Tips and Tricks for Working From Home
                </h3>
                <p className="text-gray-600 mb-4">
                  Working from home effectively requires discipline and
                  effective strategies. Start creating a dedicated workspace to
                  establish boundaries between work and personal life.{" "}
                </p>
                <a href="#" className="text-yellow-600 hover:underline">
                  Read More
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-gray-100 py-20">
        <div class="container mx-auto px-6">
          <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">
            Testimonials
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-white rounded-lg shadow-md p-6">
              <p class="text-gray-600">
                "Codebuilders has been an incredible platform for honing my
                coding skills. The variety of coding problems and challenges
                helped me improve my problem-solving abilities significantly.
                The user stats feature provided valuable insights into my
                progress, and competing on the leaderboard was both fun and
                motivating!.I really thank CodeBuilders for such a good
                platform"
              </p>
              <p class="text-gray-800 font-semibold mt-4">- John Doe</p>
            </div>

            <div class="bg-white rounded-lg shadow-md p-6">
              <p class="text-gray-600">
                "As a beginner coder, I found Codebuilders to be an invaluable
                resource. The platform offers a wide range of coding problems
                tailored to different skill levels. The user-friendly interface,
                along with detailed user stats, helped me track my progress and
                identify areas for improvement. Plus, competing on the
                leaderboard pushed me to challenge myself and strive for better
                performance."
              </p>
              <p class="text-gray-800 font-semibold mt-4">- Jane Smith</p>
            </div>

            <div class="bg-white rounded-lg shadow-md p-6">
              <p class="text-gray-600">
                "I've been using Codebuilders for a while now, and it's been
                instrumental in my coding journey. The platform not only
                provides challenging coding problems but also offers insightful
                user stats that help me gauge my performance and progress over
                time. The competitive aspect with the leaderboard adds an extra
                layer of motivation, making learning to code more engaging and
                rewarding."
              </p>
              <p class="text-gray-800 font-semibold mt-4">- David Johnson</p>
            </div>
          </div>
        </div>
      </section>
      <section class="bg-gray-200 py-20">
  <div class="container mx-auto px-6 flex flex-col lg:flex-row items-center">
   
    <div class="lg:w-1/2 mb-10 lg:mb-0">
      <img src={contactusimage} alt="Contact Us" class="rounded-lg shadow-lg" />
    </div>
    
 
    <div class="lg:w-1/2 lg:ml-10">
      <h2 class="text-3xl font-bold text-gray-800 mb-4">Contact Us</h2>
      <p class="text-gray-600 mb-8">Have a question or feedback? Reach out to us using the form below:</p>
      
     
      <form>
  <div class="mb-4">
    <label for="name" class="block text-gray-800 mb-1">Your Name</label>
    <input type="text" id="name" name="name" class="w-full h-10 rounded-lg shadow-sm border border-gray-300 focus:border-yellow-600 focus:ring focus:ring-yellow-600 focus:ring-opacity-50" />
  </div>
  <div class="mb-4">
    <label for="email" class="block text-gray-800 mb-1">Your Email</label>
    <input type="email" id="email" name="email" class="w-full h-10 rounded-lg shadow-sm border border-gray-300 focus:border-yellow-600 focus:ring focus:ring-yellow-600 focus:ring-opacity-50"/>
  </div>
  <div class="mb-4">
    <label for="message" class="block text-gray-800 mb-1">Message</label>
    <textarea id="message" name="message" rows="4" class="w-full h-15 rounded-lg shadow-sm border border-gray-300 focus:border-yellow-600 focus:ring focus:ring-yellow-600 focus:ring-opacity-50"></textarea>
  </div>
  <button type="submit" class="px-6 py-2 bg-yellow-600 text-white rounded-lg shadow-lg hover:bg-yellow-700">Send Message</button>
</form>

    </div>
  </div>
</section>
<footer class="bg-gray-800 text-white py-8">
  <div class="container mx-auto px-6">
    <div class="flex flex-col md:flex-row justify-between items-center">

      <div class="mb-4 md:mb-0">
        <h1 class="text-2xl font-bold">Codebuilders</h1>
        <p class="text-sm">Your Ultimate Online Coding Platform</p>
      </div>
      
      <ul class="flex flex-col md:flex-row">
        <li class="md:ml-6 mb-2 md:mb-0"><a href="#" class="hover:text-yellow-500">Home</a></li>
        <li class="md:ml-6 mb-2 md:mb-0"><a href="#about" class="hover:text-yellow-500">About</a></li>
        <li class="md:ml-6 mb-2 md:mb-0"><a href="#challenges" class="hover:text-yellow-500">Challenges</a></li>
        <li class="md:ml-6 mb-2 md:mb-0"><a href="#contact" class="hover:text-yellow-500">Contact</a></li>
      </ul>
    </div>
    <div class="mt-4 text-sm text-gray-600">
      <p>&copy; 2024 Codebuilders. All rights reserved.</p>
      <p>Designed with <span class="text-yellow-500">&hearts;</span> by Your Name</p>
    </div>
  </div>
</footer>
    </div>
  );
};

export default Home;
