import React from "react";

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-4">Welcome to Article Feeds</h1>
                <p className="text-lg text-gray-300">Explore and share your favorite articles.</p>
            </div>
        </div>
    );
};

export default Home;
