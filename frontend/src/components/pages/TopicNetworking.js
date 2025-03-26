import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import back from "../images/back Icon.png";
import like from "../images/icon-like.png";
import dislike from "../images/icon-dislike.png";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Leaderboards from "../Leaderboards";
import Pagination from "../Pagination";

const TopicNetworking = () => {
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const navigate = useNavigate();
  const toggleMenu = () => {
    setMenuCollapsed(!menuCollapsed);
  };

  const [] = useState(true);

  const handleBackClick = () => {
    navigate(-1);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; 
  const forums = [
    {
      topic: "Networking 1",
      title: "How to configure a switch?",
      date: "10/28/2024",
      author: "@imjuan",
      category: "Networking",
      description: "How to configure switch in Packet Tracer? I just downloaded it and I don’t know where to start.",
      likes: 30,
      dislikes: 3,
      link: "/forum/switch-configuration",
    },
    {
      topic: "Networking 1",
      title: "What is IP addressing?",
      date: "10/29/2024",
      author: "@janedoe",
      category: "IP Address",
      description: "Can someone explain the basics of IP addressing? I'm new to networking.",
      likes: 45,
      dislikes: 2,
      link: "/forum/ip-addressing",
    },
    {
      topic: "Networking 1",
      title: "VLAN setup help needed",
      date: "10/30/2024",
      author: "@networkguru",
      category: "VLAN",
      description: "I'm struggling to configure VLANs in my network. Any advice would be appreciated.",
      likes: 25,
      dislikes: 4,
      link: "/forum/vlan-setup",
    },
    {
      topic: "Networking 1",
      title: "Subnetting Basics",
      date: "11/01/2024",
      author: "@netstudent",
      category: "Networking",
      description: "Can someone help me with subnetting? I'm having a hard time understanding.",
      likes: 20,
      dislikes: 1,
      link: "/forum/subnetting-basics",
    },
    {
      topic: "Networking 1",
      title: "Understanding OSI Model",
      date: "11/02/2024",
      author: "@networkpro",
      category: "Networking",
      description: "Can someone explain the OSI model and how it relates to networking? I'm confused about the layers.",
      likes: 35,
      dislikes: 2,
      link: "/forum/osi-model",
    },
    {
      topic: "Networking 1",
      title: "How to Configure a Router",
      date: "11/05/2024",
      author: "@techgeek",
      category: "Router Configuration",
      description: "I need help configuring a router. I have basic knowledge, but I’m unsure about routing protocols.",
      likes: 40,
      dislikes: 3,
      link: "/forum/router-configuration",
    },
    {
      topic: "Networking 1",
      title: "Introduction to Firewalls",
      date: "11/06/2024",
      author: "@secguru",
      category: "Security",
      description: "What is a firewall, and how does it work in protecting a network from unauthorized access?",
      likes: 50,
      dislikes: 1,
      link: "/forum/introduction-to-firewalls",
    },
    {
      topic: "Networking 1",
      title: "Configuring DNS Servers",
      date: "11/07/2024",
      author: "@sysadmin",
      category: "DNS",
      description: "Can anyone guide me through configuring DNS servers for a local network?",
      likes: 25,
      dislikes: 4,
      link: "/forum/configuring-dns-servers",
    },
    {
      topic: "Networking 1",
      title: "What is DHCP?",
      date: "11/08/2024",
      author: "@adminexpert",
      category: "Networking",
      description: "I’m trying to understand how DHCP works. Can someone explain it with a practical example?",
      likes: 60,
      dislikes: 2,
      link: "/forum/dhcp",
    },
    {
      topic: "Networking 1",
      title: "Troubleshooting Network Latency",
      date: "11/09/2024",
      author: "@latencyfixer",
      category: "Networking",
      description: "How can I troubleshoot network latency issues effectively? My network speeds are inconsistent.",
      likes: 30,
      dislikes: 5,
      link: "/forum/network-latency",
    },
    {
      topic: "Networking 1",
      title: "Wireless Network Security",
      date: "11/10/2024",
      author: "@wirelessmaster",
      category: "Security",
      description: "What are the best practices for securing a wireless network?",
      likes: 45,
      dislikes: 3,
      link: "/forum/wireless-network-security",
    },
  ];

  const totalItems = forums.length; 

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = forums.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log("Current Page:", page);
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="flex h-screen">
      <Header />
      <Sidebar
        menuCollapsed={menuCollapsed}
        toggleMenu={toggleMenu}
      />
      <Leaderboards />
      
      <Pagination 
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />

      <main className="flex justify-center p-6 mb-[50px] mt-[50px] transition-all duration-300"
        style={{
          marginLeft: menuCollapsed ? "140px" : "340px", 
        }}
      >
        {/* Back Button */}
        <button onClick={handleBackClick} className="mb-[500px] ml-4">
          <img src={back} alt="Back" className="w-6 h-6" />
        </button>

        <div className="w-[1000px] h-[1200px] mt-24 ml-36 bg-white rounded-xl shadow-md border border-black p-6">
          <h1 className="text-3xl font-bold text-[#141E46]">Networking 1</h1>
          <p className="text-lg text-[#141E46] mt-2">
            An intro course on basic networking concepts, IP addressing, and device configuration.
          </p>
          <hr className="my-4 border-t border-[#EB6E5B]" />
          <div className="mt-4 h-[400px] space-y-6">
            {currentItems.map((forum, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(forum.link)}
              >
                <div className="mb-4">
                  <h1 className="text-xl font-light text-[#141E46]"> Topic: {forum.topic}</h1>
                  <h2 className="text-xl font-bold text-[#141E46]">{forum.title}</h2>
                  <span className="text-sm text-gray-500 block">Posted on {forum.date}</span>
                  <span className="text-sm text-gray-500 block">By: {forum.author}</span>
                </div>
                <div className="mb-4">
                  <span className="bg-[#EB6E5B] text-white px-2 py-1 rounded-full text-sm mr-2">{forum.category}</span>
                  <p className="text-gray-700 mt-2">{forum.description}</p>
                </div>

                {/* Votes */}
                <div className="flex justify-start space-x-4">
                  <button className="border-0 bg-transparent cursor-pointer text-sm text-[#141E46] flex items-center gap-1">
                    <img src={like} alt="Like" className="w-5 h-5" />
                    <span>{forum.likes}</span>
                  </button>
                  <button className="border-0 bg-transparent cursor-pointer text-sm text-[#141E46] flex items-center gap-1">
                    <img src={dislike} alt="Dislike" className="w-5 h-5" />
                    <span>{forum.dislikes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TopicNetworking;
