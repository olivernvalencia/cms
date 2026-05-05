import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Tabs = ({ tabs, id = "activeTab" }) => {
    const [activeTab, setActiveTab] = useState(() => {
        const activeTab = localStorage.getItem(id);
        return activeTab ? parseInt(activeTab) : 0;
    });

    useEffect(() => {
        localStorage.setItem(id, activeTab);
    }, [activeTab]);

    return (
        <div className="w-full mx-auto ">
            <div className="flex border-b border-gray-300">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(index)}
                        className={`relative px-6 py-3 text-base font-semibold transition-all duration-300 ease-in-out ${activeTab === index ? "text-blue-500" : "text-gray-500 hover:text-blue-500"
                            }`}
                    >
                        {tab.label}
                        {activeTab === index && (
                            <motion.div
                                layoutId="underline"
                                className="absolute bottom-0 left-0 w-full h-[4px] bg-blue-500"
                            />
                        )}
                    </button>
                ))}
            </div>
            <div className="py-8">
                {tabs[activeTab].content}
            </div>
        </div>
    );
};

export default Tabs;