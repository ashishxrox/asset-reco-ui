import React, { useState, useEffect, useRef } from 'react'
import Icon from '../../assets/icon.png';
import ReactMarkdown from 'react-markdown';
import MarkdownTable from './MarkdownTable'
import { marked } from 'marked';
import html2pdf from 'html2pdf.js';;

import './chatbot.css';



const Chatbot = ({ assetList }) => {

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);


    // const APIurl = "https://devapi.monetez.com/api/univerze/v1/chat"
    const APIurl = "http://localhost:8000/api/univerze/v1/chat"


    const cleanMarkdown = (text) => {
        return text
            .replace(/^#+\s*Asset Allocation Table\s*$/im, '')
            .replace(/^#+\s*Allocation Table\s*$/im, '')
            .replace(/^\s*Asset Allocation Table\s*$/im, '')
            .replace(/^\s*Allocation Table\s*$/im, '')
            .trim();
    };

    const handleSend = async () => {
        if (newMessage.trim() === '') return;

        const time = new Date().toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });

        const userMessage = { text: newMessage, sender: 'user', time };
        setMessages((prev) => [...prev, userMessage]);
        setNewMessage('');
        setIsTyping(true);

        try {
            const conversationId = localStorage.getItem('conversation_id');
            console.log(conversationId)
            if (!conversationId) throw new Error('Missing conversation ID');

            // Build the chat history payload (excluding system messages)
            const chatHistory = messages.map((msg) => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text,
            }));

            const response = await fetch(APIurl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversation_id: conversationId,
                    user_input: newMessage,
                    messages: chatHistory,
                }),
            });

            const data = await response.json();
            console.log(data.data)
            const modifiedMessage = (data.data.reply || '😓 No response from AI.').replace(/\n\n/g, '\n');
            console.log(modifiedMessage)

            const botMessage = {
                text: modifiedMessage,
                sender: 'bot',
                time,
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error('Error:', error);
            setMessages((prev) => [
                ...prev,
                {
                    text: '😓 Oops! Something went wrong while fetching the response. Please try again.',
                    sender: 'bot',
                    time,
                },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    const containsMarkdownTable = (markdown) => {
        const tableRegex = /^\s*\|(.+)\|\s*\n\s*\|[-\s|:]+\|\s*\n((\s*\|.*\|\s*\n?)*)/m;
        return tableRegex.test(markdown);
    };

    // Update your parseMarkdownTable function to be more robust
    const parseMarkdownTable = (markdown) => {
        // First, extract just the table portion from the markdown
        const tableRegex = /^\s*\|(.+)\|\s*\n\s*\|[-\s|:]+\|\s*\n((\s*\|.*\|\s*\n?)*)/m;
        const match = markdown.match(tableRegex);

        if (!match) return { headers: [], rows: [], remainingText: markdown };

        const table = match[0];
        const remainingText = markdown.replace(table, '').trim();

        // Process the table lines
        const lines = table.trim().split('\n').filter(line => line.trim().startsWith('|'));

        // Extract headers (first line)
        const headers = lines[0]
            .split('|')
            .map(cell => cell.trim())
            .filter(cell => cell && !cell.match(/^-+$/)); // Filter out divider cells

        // Extract rows (lines after the divider)
        const rows = lines.slice(2).map(line =>
            line.split('|')
                .map(cell => cell.trim())
                .filter((cell, i) => i > 0 && i < headers.length + 1) // Skip empty cells at start/end
        );

        return { headers, rows, remainingText };
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    const handleRefresh = () => {
        console.log("clicked")
        window.location.reload(true); // true forces a hard reload from the server
    };

    

   

   

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const chatRef = useRef();

    function convertChatToMarkdown(messages) {
        if (!Array.isArray(messages)) {
            console.error("Invalid input: expected an array of messages.");
            return '';
        }

        return messages.map(msg => {
            if (!msg || !msg.sender || !msg.text) return '';
            const role = msg.sender === 'user' ? '### User:' : '### Assistant:';
            return `${role}\n${msg.text.trim()}\n`;
        }).join('\n');
    }



    function downloadMarkdownFile(markdownContent, filename = 'chat-history.md') {
        const blob = new Blob([markdownContent], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    // async function downloadMarkdownAsPDF(markdownText) {
    //     // Convert markdown to HTML
    //     const htmlContent = marked.parse(markdownText);
      
    //     // Create a temporary container to render HTML
    //     const container = document.createElement('div');
    //     container.innerHTML = htmlContent;
    //     container.style.padding = '20px';
    //     container.style.maxWidth = '600px';
    //     container.style.fontFamily = 'Arial, sans-serif';
    //     document.body.appendChild(container);
      
    //     // Render the HTML to canvas
    //     const canvas = await html2canvas(container);
    //     const imgData = canvas.toDataURL('image/png');
      
    //     // Create PDF
    //     const pdf = new jsPDF({
    //       orientation: 'p',
    //       unit: 'pt',
    //       format: 'a4',
    //     });
      
    //     const imgProps = pdf.getImageProperties(imgData);
    //     const pdfWidth = pdf.internal.pageSize.getWidth();
    //     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
    //     pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    //     pdf.save('chat-conversation.pdf');
      
    //     // Clean up
    //     document.body.removeChild(container);
    //   }

    const downloadMarkdownAsPDF = (markdownText) => {
        // Convert markdown to HTML
        const htmlContent = marked.parse(markdownText);
      
        // Create a container div
        const container = document.createElement('div');
        container.innerHTML = htmlContent;
        container.style.padding = '20px';
        container.style.maxWidth = '800px';
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.fontSize = '12px';
      
        // Add to the body temporarily
        document.body.appendChild(container);
      
        // Convert to PDF
        const opt = {
          margin:       0.5,
          filename:     'chat-conversation.pdf',
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2 },
          jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
          pagebreak:    { mode: ['css', 'legacy'] } // enable auto page breaks
        };
      
        html2pdf().set(opt).from(container).save().then(() => {
          document.body.removeChild(container);
        });
      };


    const handleGenerateMarkdown = () => {
        console.log(messages)
        const markdown = convertChatToMarkdown(messages);
        downloadMarkdownFile(markdown);
        downloadMarkdownAsPDF(markdown);
        console.log(markdown)
    }




    return (
        <div className='h-[95vh] w-[85%] rounded-[20px] overflow-hidden flex flex-col justify-between items-center' style={{ boxShadow: "3px 3px 25px #808080" }}>
            {/* Header */}
            <div className='basis-[15%] header w-full bg-gradient-to-r from-[#3f89ff] to-[#62b4ff] flex justify-between items-center flex-row'>
                <div className='basis-[45%] w-full h-full flex items-center gap-[10px] pl-[30px] '>

                    <div className='w-[65px] h-[65px] rounded-full bg-white bg-center bg-cover' style={{ backgroundImage: `url("${Icon}")` }}></div>
                    <div>
                        <h4 className='text-sm text-white'>Chat with</h4>
                        <h2 className='text-xl font-bold text-white'>Univerze AI</h2>
                    </div>
                </div>
                <div className='basis-[40%] w-full h-full flex justify-around items-center'>
                    <button
                        onClick={handleGenerateMarkdown}
                        className="px-6 py-3 bg-[white] text-[#30965f] cursor-pointer rounded-[20px] shadow-md hover:shadow-lg  transition-all duration-300 text-lg font-semibold tracking-wide">
                        Generate PDF Report
                    </button>
                    <button
                        onClick={() => { handleRefresh() }}
                        className="px-6 py-3 bg-[white] text-[#30965f] cursor-pointer rounded-[20px] shadow-md hover:shadow-lg  transition-all duration-300 text-lg font-semibold tracking-wide">
                        Start New Chat
                    </button>
                </div>

            </div>
            <div className='basis-[70%] w-full overflow-y-auto overflow-x-hidden p-4 bg-white scroll-div' id='chat-container' ref={chatRef}>
                {/* <div className=' bg-[red] h-[100px] w-[500px] z-[9] top-[-60px] right-[16px] pr-[50px] relative waves flex justify-end items-center'>
                    <p className='text-white text-[18px] mt-[5px] font-[500]'>Your Expert Media Planner</p>
                </div> */}
                {messages.map((msg, idx) => (
                    <div key={idx} className={`mb-4 flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center mb-1 gap-2">
                            {msg.sender === 'user' ? (
                                <>
                                    <span className="text-sm text-gray-600 font-medium">You</span>
                                    <img src="https://www.gravatar.com/avatar/?d=mp&f=y" alt="User avatar" className="w-8 h-8 border-4 border-[#2f965f] rounded-full" />
                                </>
                            ) : (
                                <>
                                    <img src={Icon} alt="Bot" className="w-8 h-8 border-4 border-[#2f965f] rounded-full" />
                                    <span className="text-sm text-gray-600 font-medium">Univerze AI</span>
                                </>
                            )}
                        </div>

                        <div className={` max-w-[85%] text-[16px] whitespace-pre-wrap break-words shadow-lg ${msg.sender === 'user'
                            ? 'rounded-xl bg-[#2f965f] text-white rounded-tr-none p-2'
                            : 'text-black rounded-xl p-[1.3rem]'}`}>
                            {msg.sender === 'bot' ? (() => {
                                if (containsMarkdownTable(msg.text)) {
                                    const tableRegex = /^\s*\|(.+)\|\s*\n\s*\|[-\s|:]+\|\s*\n((\s*\|.*\|\s*\n?)*)/m;
                                    const match = msg.text.match(tableRegex);

                                    const table = match[0];
                                    const remainingText = msg.text.replace(table, '').trim();

                                    const { headers, rows } = parseMarkdownTable(table);

                                    return (
                                        <div className="flex flex-col gap-4 ]">
                                            {/* {remainingText && <ReactMarkdown>{remainingText}</ReactMarkdown>} */}
                                            {/* {remainingText && <MarkdownPreview
                                            source={remainingText}
                                            className='markdown-preview text-black'
                                            />} */}
                                            {remainingText && <ReactMarkdown>{remainingText}</ReactMarkdown>}
                                            <MarkdownTable headers={headers} rows={rows} />
                                        </div>
                                    );
                                } else {
                                    return <ReactMarkdown>{cleanMarkdown(msg.text)}</ReactMarkdown>;
                                    // return <MarkdownPreview
                                    // source={msg.text}
                                    // className='markdown-preview text-black'
                                    // />
                                }
                            })() : (
                                <div>{msg.text}</div>
                            )}

                        </div>
                        <div className="text-xs text-gray-500 mt-1">{msg.time}</div>
                    </div>
                ))}

                {/* Typing Animation  */}
                {isTyping && (
                    <div className="mb-4 flex flex-col items-start">
                        <div className="flex items-center mb-1 gap-2">
                            <img src={Icon} alt="Bot" className="w-8 h-8 border-4 border-[#2f965f] rounded-full" />
                            <span className="text-sm text-gray-600 font-medium">Univerze AI</span>
                        </div>
                        <div className="flex space-x-1 px-3 py-2 bg-white rounded-xl w-fit">
                            <span className="w-2 h-2 bg-[#2f965f] rounded-full animate-bounce [animation-delay:0.1s]" />
                            <span className="w-2 h-2 bg-[#2f965f] rounded-full animate-bounce [animation-delay:0.2s]" />
                            <span className="w-2 h-2 bg-[#2f965f] rounded-full animate-bounce [animation-delay:0.3s]" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="basis-[15%] header w-full flex flex-col justify-center px-4 py-2">
                <div className="relative w-full">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Need help with marketing campaigns? Ask here."
                        className="w-full border border-gray-300 rounded-[12px] bg-white p-3 pr-16 focus:outline-none"
                    />
                    <button
                        onClick={handleSend}
                        className="absolute right-5 top-1/2 transform -translate-y-1/2 flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" style={{ fill: '#1480b7' }}>
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                    </button>
                </div>
                <div className="flex items-center justify-center mt-2">

                    <p className="text-xs text-white ml-2 text-center w-full">Univerze AI can make mistakes. Check important info.</p>
                </div>
            </div>
        </div>
    )
}

export default Chatbot






