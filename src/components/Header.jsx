import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";
import { addUser, removeUser } from "../utils/userSlice";
import { toggleGptSearchView } from "../utils/gptSlice";
import { LOGO } from "../utils/constant";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { FaXTwitter, FaInstagram, FaLinkedin } from "react-icons/fa6";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const showGptSearch = useSelector((store) => store.gemini.showGptSearch);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        console.error(error);
        navigate("/error");
      });
  };

  const handleGptSearchClick = () => {
    dispatch(toggleGptSearchView());
  };

  // Function to refresh page and navigate to browse
  const refreshAndNavigate = () => {
    window.location.href = "/browse";
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName, photoURL } = user;
        dispatch(
          addUser({
            uid: uid,
            email: email,
            displayName: displayName,
            photoURL: photoURL,
          })
        );
        navigate("/browse");
      } else {
        // User is signed out
        dispatch(removeUser());
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <div className="fixed top-0 w-full z-50 bg-gradient-to-b from-black to-transparent flex justify-between items-center p-4 md:px-10 md:py-6">
        <div className="w-32 md:w-44 md:ml-4">
          <img
            src={LOGO}
            className="w-full cursor-pointer"
            alt="Logo"
            onClick={user ? refreshAndNavigate : () => navigate("/")}
          />
        </div>

        {user && (
          <>
            {/* Mobile Hamburger Menu Icon */}
            <div className="md:hidden">
              <GiHamburgerMenu
                className="text-white w-8 h-8 cursor-pointer"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex md:items-center md:space-x-6 md:ml-auto">
              {/* Only show Home button when not in GPT search view */}
              {!showGptSearch && (
                <button
                  onClick={refreshAndNavigate}
                  className="text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition duration-300"
                >
                  Home
                </button>
              )}

              <button
                onClick={handleGptSearchClick}
                className="text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition duration-300"
              >
                {showGptSearch ? "Home" : "AI Recommends"}
              </button>

              <Link to="/favourites">
                <button className="text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition duration-300">
                  Favourites
                </button>
              </Link>

              <button
                onClick={handleSignOut}
                className="text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition duration-300"
              >
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed z-50 bg-black h-screen w-full top-0 transition-transform duration-300 transform ${
          isMenuOpen && user ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="absolute top-0 left-0 z-[-2] h-full w-full bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <div className="flex justify-end p-4">
          <IoMdClose
            className="text-white w-8 h-8 cursor-pointer"
            onClick={() => setIsMenuOpen(false)}
          />
        </div>
        <div className="flex flex-col items-end pr-4 pt-8 space-y-8">
          {/* Only show Home link when not in GPT search view */}
          {!showGptSearch && (
            <span
              onClick={() => {
                setIsMenuOpen(false);
                refreshAndNavigate();
              }}
              className="border-b-2 border-red-600 pb-1 text-white text-xl hover:text-red-600 transition duration-300 cursor-pointer"
            >
              Home
            </span>
          )}

          <span
            onClick={() => {
              handleGptSearchClick();
              setIsMenuOpen(false);
            }}
            className="border-b-2 border-red-600 pb-1 text-white text-xl hover:text-red-600 transition duration-300 cursor-pointer"
          >
            {showGptSearch ? "Home" : "AI Recommends"}
          </span>

          <Link to="/favourites" onClick={() => setIsMenuOpen(false)}>
            <span className="border-b-2 border-red-600 pb-1 text-white text-xl hover:text-red-600 transition duration-300 cursor-pointer">
              Favourites
            </span>
          </Link>

          <span
            onClick={() => {
              handleSignOut();
              setIsMenuOpen(false);
            }}
            className="border-b-2 border-red-600 pb-1 text-white text-xl hover:text-red-600 transition duration-300 cursor-pointer"
          >
            Sign Out
          </span>

          <div className="flex justify-around w-[35%] text-3xl">
            <FaXTwitter
              className="text-white cursor-pointer"
              onClick={() => window.open("https://x.com", "_blank")}
            />
            <FaLinkedin
              className="text-blue-500 cursor-pointer"
              onClick={() => window.open("https://www.linkedin.com", "_blank")}
            />
            <FaInstagram
              className="text-pink-500 cursor-pointer"
              onClick={() => window.open("https://www.instagram.com", "_blank")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
