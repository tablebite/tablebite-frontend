import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

function Landing() {
  return (
    <div className="min-h-screen text-gray-800 flex flex-col">
      {/* Header Section */}
      <header className="w-full bg-gray-900 text-white px-6 md:px-12 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-red-600">tablebite.in</h1>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition">
            LOGIN
          </button>
          <button className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 transition">
            CONTACT
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-16 px-6 md:px-12 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Redefining Luxury Dining Experiences
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Transform your dining with Tablebite. Scan the QR code and enjoy a
          seamless, paperless menu experience tailored for luxury.
        </p>

        {/* Stylish QR Code */}
        <div className="flex justify-center items-center mt-8">
          <div className="relative p-4 bg-white rounded-2xl shadow-2xl border-4 border-red-500 hover:scale-105 transition-transform duration-300">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://tablebite.in"
              alt="Scan QR Code"
              className="w-48 h-48 rounded-md"
            />
            <p className="text-gray-600 mt-4 text-sm font-medium">
              Scan to Explore Tablebite
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 md:px-12 bg-white text-gray-900 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-8">Why Choose Tablebite?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Digitally available",
              description:
                "Your customers can access the menu on their own device at any time, without any app install.",
              icon: "fa-solid:qrcode",
            },
            {
              title: "Multiple menu cards",
              description:
                "Add multiple menus for your takeaway, catering, wines, drinks, desserts, and more.",
              icon: "fa-solid:book-open",
            },
            {
              title: "Menu on your website",
              description:
                "Integrate the menu into your own website, letting your customers view the menu seamlessly.",
              icon: "fa-solid:globe",
            },
            {
              title: "Change your menu at any time",
              description:
                "Make changes to your menu in real-time and notify customers about unavailability or updates.",
              icon: "fa-solid:clock",
            },
            {
              title: "Design your menu",
              description:
                "Personalize your menu with unique styles, colors, and layouts to match your branding.",
              icon: "fa-solid:palette",
            },
            {
              title: "Filter on allergens and preferences",
              description:
                "Allow customers to filter allergens and dietary preferences to improve their experience.",
              icon: "fa-solid:filter",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-6 border border-gray-200 rounded-lg shadow-lg hover:shadow-2xl transition"
            >
              <Icon
                icon={feature.icon}
                className="text-4xl text-red-500 mb-4"
              />
              <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Eco-Friendly Section */}
      <section className="py-16 px-6 md:px-12 text-center bg-gray-50">
        <h2 className="text-3xl md:text-5xl font-bold mb-8">
          Going digital and eco-friendly
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          By using Tablebite, you ensure that all your menus are{" "}
          <strong>digitally available</strong> to your customers. This reduces
          costs and helps the environment by eliminating paper menus.{" "}
          <strong>Powered by renewable energy</strong>.
        </p>
      </section>

      {/* Co-Founders Section */}
      <section className="py-16 px-6 md:px-12 bg-white text-gray-900 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-8">Meet the Founders</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {[
            { name: "Dhanesh KJ", role: "Co-Founder" },
            { name: "Aneesh Edavath", role: "Co-Founder" },
            { name: "Jessmon T James", role: "Co-Founder" },
          ].map((founder, idx) => (
            <div
              key={idx}
              className="p-6 bg-gray-100 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition w-60 text-center"
            >
              <Icon
                icon="fa-solid:user"
                className="text-4xl text-red-500 mb-4"
              />
              <h3 className="text-2xl font-semibold mb-1">{founder.name}</h3>
              <p className="text-gray-600">{founder.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-gray-100 py-8 text-center">
        <p>&copy; {new Date().getFullYear()} tablebite.in. All rights reserved.</p>
        <div className="text-sm mt-2">
          We use cookies to ensure you get the best experience on our website.{" "}
          <a href="#cookie-policy" className="underline">
            More in our <strong>cookie policy</strong>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
