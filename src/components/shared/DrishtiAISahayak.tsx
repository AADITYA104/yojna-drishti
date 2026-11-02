"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { demoSchemes } from "@/lib/demo-data";

interface DrishtiAISahayakProps {
  gu: boolean;
  onNavigate: (page: any) => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  suggestedAction?: { label: string; page: string };
}

export function DrishtiAISahayak({ gu, onNavigate }: DrishtiAISahayakProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      sender: "bot",
      text: gu
        ? "નમસ્તે! હું 'દૃષ્ટિ AI સહાયક' છું. ગુજરાત સરકારની મહિલા, બાળ કલ્યાણ અને ખેડૂત યોજનાઓ, પાત્રતા અને દસ્તાવેજો વિશે મને કંઈપણ પૂછો."
        : "Namaste! I am 'Drishti AI Sahayak'. Ask me anything about Gujarat Government schemes, eligibility criteria, and required documents.",
      timestamp: "હમણાં",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const quickPrompts = gu
    ? [
        "દીકરીઓ માટે કઈ યોજના છે?",
        "ગંગા સ્વરૂપા વિધવા સહાય વિશે કહો",
        "જરૂરી દસ્તાવેજો શું જોઈએ?",
        "નકશામાં મારું ગામ કેવી રીતે જોવું?",
      ]
    : [
        "Schemes for Girl Child",
        "Tell me about Ganga Swarupa",
        "Mandatory documents needed?",
        "How to view my village on map?",
      ];

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: "user",
      text,
      timestamp: "હમણાં",
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");

    // Generate intelligent Gujarat-government scheme contextual reply
    setTimeout(() => {
      const lower = text.toLowerCase();
      let botResponse = "";
      let action: { label: string; page: string } | undefined;

      if (lower.includes("દીકરી") || lower.includes("girl") || lower.includes("કન્યા") || lower.includes("વાહલી")) {
        botResponse = gu
          ? "દીકરીઓ માટે 'વહાલી દીકરી યોજના' (VDY) હેઠળ કુલ ₹૧,૧૦,૦૦૦ ની સહાય ત્રણ તબક્કે (પહેલા ધોરણમાં ₹૪,૦૦૦, નવમા ધોરણમાં ₹૬,૦૦૦ અને ૧૮ વર્ષે ઉચ્ચ શિક્ષણ/લગ્ન માટે ₹૧,૦૦,૦૦૦) સીધા બેંક ખાતામાં જમા થાય છે."
          : "Under 'Vahali Dikri Yojana', total assistance of ₹1,10,000 is given across 3 milestones (Class 1: ₹4,000, Class 9: ₹6,000, and at age 18: ₹1,00,000).";
        action = { label: gu ? "યોજનાઓની યાદી જુઓ" : "View Schemes", page: "schemes" };
      } else if (lower.includes("વિધવા") || lower.includes("ગંગા") || lower.includes("widow")) {
        botResponse = gu
          ? "'ગંગા સ્વરૂપા આર્થિક સહાય યોજના' હેઠળ વિધવા બહેનોને દર મહિને ₹૧,૨૫૦ (વાર્ષિક ₹૧૫,૦૦૦) સીધા બેંક ખાતામાં DBT મારફતે ચૂકવવામાં આવે છે. આ સહાય પુનઃલગ્ન ન થાય ત્યાં સુધી આજીવન ચાલુ રહે છે."
          : "Under Ganga Swarupa Yojana, widowed sisters receive ₹1,250 monthly (₹15,000/year) direct to bank via DBT.";
        action = { label: gu ? "પાત્રતા ચકાસો" : "Check Eligibility", page: "public" };
      } else if (lower.includes("દસ્તાવેજ") || lower.includes("document") || lower.includes("પુરાવા")) {
        botResponse = gu
          ? "મોટાભાગની યોજનાઓ માટે સામાન્ય રીતે: ૧) આધાર કાર્ડ, ૨) રેશન કાર્ડ, ૩) આવકનો દાખલો (મામલતદાર/તલાટીનો), ૪) બેંક પાસબુકની પ્રથમ પાનાની નકલ અને ૫) પાસપોર્ટ સાઇઝ ફોટો જરૂરી હોય છે."
          : "Generally required: 1) Aadhaar Card, 2) Ration Card, 3) Income Certificate, 4) Bank Passbook, and 5) Passport photo.";
        action = { label: gu ? "નાગરિક પોર્ટલ ખોલો" : "Open Citizen Portal", page: "public" };
      } else if (lower.includes("ગામ") || lower.includes("નકશો") || lower.includes("map") || lower.includes("village")) {
        botResponse = gu
          ? "તમે 'ભૂગોળ નકશો' (Map Explorer) માં જઈને તમારા જિલ્લા પર ક્લિક કરો, ત્યારબાદ તાલુકો પસંદ કરો. તમારા ગામનું નામ પસંદ કરતાં જ તે ગામમાં કઈ કઈ યોજનાઓ પહોંચી છે તેનો સંપૂર્ણ રિપોર્ટ દેખાશે!"
          : "Go to 'Map Explorer', click your District, select your Taluka, then pick your Village to view live delivered schemes and DBT stats.";
        action = { label: gu ? "મુખ્ય નકશો ખોલો" : "Open Main Map", page: "map" };
      } else {
        botResponse = gu
          ? "ગુજરાત સરકારની મહિલા અને બાળ વિકાસ વિભાગની ૧૦ મુખ્ય યોજનાઓ હાલ 'યોજના દૃષ્ટિ' પ્લેટફોર્મ પર મેપ થયેલી છે. તમે 'યોજના શોધક' ટેબમાં જઈને તમારી ઉંમર અને આવક મુજબ પાત્રતા ચકાસી શકો છો."
          : "Gujarat WCD currently tracks 10 core schemes on this platform. You can check your eligibility in the Public Citizen Finder tab.";
        action = { label: gu ? "યોજના શોધક" : "Scheme Finder", page: "public" };
      }

      const botMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: "bot",
        text: botResponse,
        timestamp: "હમણાં",
        suggestedAction: action,
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        type="button"
        className={`drishti-ai-floating-trigger ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen((open) => !open)}
        aria-label={gu ? "દૃષ્ટિ AI સહાયક સાથે વાત કરો" : "Chat with Drishti AI Assistant"}
        title={gu ? "દૃષ્ટિ AI સહાયક" : "Drishti AI Assistant"}
      >
        <span className="dai-trigger-icon-wrap">
          {isOpen ? <X size={22} /> : <Sparkles size={22} />}
        </span>
        <span className="dai-trigger-text">
          {gu ? "દૃષ્ટિ AI સહાયક" : "Drishti AI Sahayak"}
        </span>
        <span className="dai-trigger-badge">AI</span>
      </button>

      {/* Chat Window Popup */}
      {isOpen && (
        <div className="drishti-ai-popup-card" role="dialog" aria-modal="false">
          {/* Header */}
          <div className="dai-card-header">
            <div className="dai-header-title">
              <span className="dai-bot-avatar">
                <Bot size={20} />
              </span>
              <div>
                <strong>{gu ? "દૃષ્ટિ AI નાગરિક સહાયક" : "Drishti AI Assistant"}</strong>
                <small className="dai-status-line">
                  <span className="dai-online-dot" />
                  {gu ? "ગુજરાત યોજના જ્ઞાનકોશ સક્રિય" : "Govt Scheme Intelligence Active"}
                </small>
              </div>
            </div>
            <button
              className="dai-header-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label={gu ? "બંધ કરો" : "Close"}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Body */}
          <div className="dai-card-body">
            {messages.map((m) => (
              <div key={m.id} className={`dai-message-row dai-message--${m.sender}`}>
                <span className="dai-msg-avatar">
                  {m.sender === "bot" ? <Bot size={15} /> : <User size={15} />}
                </span>
                <div className="dai-msg-bubble">
                  <p>{m.text}</p>
                  {m.suggestedAction && (
                    <button
                      className="dai-action-pill-btn"
                      onClick={() => {
                        onNavigate(m.suggestedAction?.page);
                        setIsOpen(false);
                      }}
                    >
                      <span>{m.suggestedAction.label}</span>
                      <ChevronRight size={14} />
                    </button>
                  )}
                  <small className="dai-msg-time">{m.timestamp}</small>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="dai-quick-prompts-bar">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                className="dai-prompt-chip"
                onClick={() => handleSend(p)}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            className="dai-card-footer"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={gu ? "યોજના અથવા સહાય વિશે પૂછો..." : "Ask about schemes or benefits..."}
              aria-label={gu ? "સંદેશ લખો" : "Type a message"}
            />
            <button
              type="submit"
              className="dai-send-btn"
              disabled={!inputText.trim()}
              aria-label={gu ? "મોકલો" : "Send"}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
