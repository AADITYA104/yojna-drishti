"use client";

import React, { useState, useRef, useEffect } from "react";
import { localizeText } from "@/lib/i18n";
import type { AppLanguage } from "@/lib/i18n";
import {
  Headphones,
  X,
  Send,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface DrishtiAISahayakProps {
  gu: boolean;
  lang: AppLanguage;
  onNavigate: (page: string, searchTerm?: string) => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  suggestedAction?: { label: string; page: string; searchTerm?: string };
}

export function DrishtiAISahayak({ gu, lang, onNavigate }: DrishtiAISahayakProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      sender: "bot",
      text: gu
        ? "નમસ્તે! આ સહાયક જાહેર પૂર્વદર્શનનો ભાગ છે. અહીં યોજનાઓના કૃત્રિમ નમૂના દેખાય છે; સત્તાવાર પાત્રતા, સહાયની રકમ, દસ્તાવેજો કે અરજીની સ્થિતિ જોડાયેલી નથી. અરજી કરતાં પહેલાં સંબંધિત સરકારી વિભાગ પાસેથી માહિતી ચકાસો. તમને કઈ માહિતી જોઈએ છે?"
        : lang === "hi"
          ? "नमस्ते! यह सहायक सार्वजनिक पूर्वावलोकन का हिस्सा है। यहाँ योजनाओं के कृत्रिम नमूने दिखते हैं; आधिकारिक पात्रता, सहायता राशि, दस्तावेज़ या आवेदन स्थिति जुड़ी नहीं है। आवेदन से पहले संबंधित सरकारी विभाग से जानकारी की पुष्टि करें। आपको क्या जानना है?"
          : "Hello. This preview assistant can help you browse sample entries. Official eligibility, benefit amounts, required documents, and application status are not connected. Confirm details with the relevant government department before applying. What would you like to find?",
      timestamp: gu ? "પૂર્વદર્શન સહાયક" : lang === "hi" ? "पूर्वावलोकन सहायक" : "Preview assistant",
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
        "દીકરીઓ માટેની યોજનાઓ",
        "ગંગા સ્વરૂપા વિધવા સહાય",
        "જરૂરી દસ્તાવેજોની યાદી",
        "અરજી ક્યાં જમા કરાવવી?",
      ]
    : lang === "hi"
      ? [
          "बालिकाओं के लिए योजनाएँ",
          "गंगा स्वरूपा विधवा सहायता",
          "आवश्यक दस्तावेज़ों की सूची",
          "आवेदन कहाँ जमा करें?",
        ]
      : [
          "Girl Child Schemes",
          "Ganga Swarupa Pension",
          "Required Documents",
          "Where to submit form?",
        ];

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text,
      timestamp: gu ? "તમારો પ્રશ્ન" : lang === "hi" ? "आपका प्रश्न" : "You",
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");

    setTimeout(() => {
      const lower = text.toLowerCase();
      let botResponse = "";
      let action: ChatMessage["suggestedAction"];

      if (lower.includes("દીકરી") || lower.includes("girl") || lower.includes("कन्या") || lower.includes("बालिका") || lower.includes("लड़की") || lower.includes("વાહલી")) {
        botResponse = gu
          ? "નમૂના કેટલોગમાં દીકરીઓ સંબંધિત યોજનાઓની કેટલીક એન્ટ્રીઓ છે. અહીં રકમ, પાત્રતા, અરજીની સ્થિતિ કે સત્તાવાર સ્રોત ચકાસેલા નથી. અરજી કરતાં પહેલાં સત્તાવાર યોજના પોર્ટલ અથવા સંબંધિત વિભાગ તપાસો."
          : lang === "hi"
            ? "नमूना सूची में बालिकाओं से जुड़ी कुछ योजना प्रविष्टियाँ हैं। यहाँ राशि, पात्रता, आवेदन की स्थिति या आधिकारिक स्रोत सत्यापित नहीं हैं। आवेदन से पहले आधिकारिक पोर्टल या संबंधित विभाग से पुष्टि करें।"
            : "The sample catalogue contains a few entries related to girls. Benefit amounts, eligibility, application status, and official sources are not verified here. Check the official scheme portal or department before applying.";
        action = {
          label: gu ? "વ્હાલી દીકરી યોજના જુઓ" : lang === "hi" ? "व्हाली दीकरी योजना देखें" : "View Vahali Dikri Yojana",
          page: "schemes",
          searchTerm: gu ? "વ્હાલી દીકરી" : "Vahali Dikri",
        };
      } else if (lower.includes("વિધવા") || lower.includes("गंगा") || lower.includes("विधवा") || lower.includes("widow")) {
        botResponse = gu
          ? "નમૂના કેટલોગમાં ગંગા સ્વરૂપા યોજનાની એન્ટ્રી છે. તેની હાલની પાત્રતા, સહાયની રકમ, અરજીની રીત કે સ્થિતિ અહીં સત્તાવાર રીતે ચકાસેલી નથી. અરજી પહેલાં સંબંધિત સરકારી વિભાગ પાસેથી માહિતી મેળવો."
          : lang === "hi"
            ? "नमूना सूची में गंगा स्वरूपा योजना की प्रविष्टि है। इसकी वर्तमान पात्रता, सहायता राशि, आवेदन प्रक्रिया या स्थिति यहाँ आधिकारिक रूप से सत्यापित नहीं है। आवेदन से पहले संबंधित विभाग से जानकारी लें।"
            : "The sample catalogue includes a Ganga Swarupa entry. Current eligibility, benefit amount, application process, and status are not officially verified here. Confirm them with the relevant government department before applying.";
        action = {
          label: gu ? "ગંગા સ્વરૂપા સહાય જુઓ" : lang === "hi" ? "गंगा स्वरूपा योजना देखें" : "View Ganga Swarupa Scheme",
          page: "schemes",
          searchTerm: gu ? "ગંગા સ્વરૂપા" : "Ganga Swarupa",
        };
      } else if (lower.includes("દસ્તાવેજ") || lower.includes("document") || lower.includes("પુરાવા") || lower.includes("दस्तावेज़") || lower.includes("दस्तावेज") || lower.includes("कागज़")) {
        botResponse = gu
          ? "દસ્તાવેજોની યાદી દરેક યોજના પ્રમાણે અલગ હોઈ શકે છે. આ પૂર્વદર્શનમાં સત્તાવાર ચેકલિસ્ટ જોડાયેલી નથી. વ્યક્તિગત ઓળખ અથવા બેંકની વિગતો અહીં મોકલશો નહીં; યોજનાના સત્તાવાર પોર્ટલ અથવા વિભાગ પાસે જરૂરી યાદી તપાસો."
          : lang === "hi"
            ? "दस्तावेज़ों की सूची हर योजना के अनुसार अलग हो सकती है। इस पूर्वावलोकन में आधिकारिक सूची जुड़ी नहीं है। अपनी पहचान या बैंक विवरण यहाँ साझा न करें; आधिकारिक पोर्टल या विभाग से आवश्यक सूची जाँचें।"
            : "Document requirements vary by scheme. This preview does not include an official checklist. Do not share identity or bank details here; check the scheme’s official portal or department for the required documents.";
        action = {
          label: gu ? "સ્માર્ટ પાત્રતા વિઝાર્ડ ખોલો" : lang === "hi" ? "स्मार्ट पात्रता विज़ार्ड खोलें" : "Open Eligibility Wizard",
          page: "wizard",
        };
      } else if (lower.includes("ક્યાં") || lower.includes("જમા") || lower.includes("અરજી") || lower.includes("form") || lower.includes("कहाँ") || lower.includes("जमा") || lower.includes("आवेदन") || lower.includes("फ़ॉर्म") || lower.includes("फॉर्म")) {
        botResponse = gu
          ? "આ પૂર્વદર્શનમાં સત્તાવાર અરજી લિંક, અંતિમ તારીખ અથવા કચેરીનો સંપર્ક જોડાયેલો નથી. અરજી ક્યાં કરવી તે યોજનાના સત્તાવાર પોર્ટલ અથવા સંબંધિત વિભાગ પાસે ચકાસો."
          : lang === "hi"
            ? "इस पूर्वावलोकन में आधिकारिक आवेदन लिंक, अंतिम तिथि या कार्यालय का संपर्क जुड़ा नहीं है। कहाँ आवेदन करना है, यह योजना के आधिकारिक पोर्टल या संबंधित विभाग से जाँचें।"
            : "This preview has no official application link, deadline, or office contact. Check the scheme’s official portal or department to confirm where and how to apply.";
        action = {
          label: gu ? "જિલ્લા અને કચેરીઓ જુઓ" : lang === "hi" ? "जिले और कार्यालय देखें" : "Explore District Offices",
          page: "map",
        };
      } else {
        botResponse = gu
          ? "યોજના દૃષ્ટિનું આ જાહેર પૂર્વદર્શન કૃત્રિમ નમૂનાના દાખલા બતાવે છે; ગુજરાત સરકારની તમામ યોજનાઓ કે સત્તાવાર પાત્રતા/સહાય માહિતી અહીં જોડાયેલી નથી."
          : lang === "hi"
            ? "योजना दृष्टि का यह सार्वजनिक पूर्वावलोकन कृत्रिम नमूना प्रविष्टियाँ दिखाता है; गुजरात की सभी योजनाएँ या आधिकारिक पात्रता/सहायता विवरण यहाँ जुड़े नहीं हैं।"
            : "This public preview shows synthetic sample entries. It is not a complete list of Gujarat schemes, and official eligibility or benefit data is not connected.";
        action = {
          label: gu ? "યોજના નિર્દેશિકા જુઓ" : lang === "hi" ? "योजना सूची देखें" : "Browse Schemes Directory",
          page: "schemes",
        };
      }

      const botMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: "bot",
        text: botResponse,
        timestamp: gu ? "પૂર્વદર્શન સહાયક" : lang === "hi" ? "पूर्वावलोकन सहायक" : "Preview assistant",
        suggestedAction: action,
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 400);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        type="button"
        className={`gov-helpdesk-floating-trigger ${isOpen ? "is-open" : ""}`}
        style={{
          bottom: "calc(var(--nav-h, 68px) + 32px + env(safe-area-inset-bottom))",
          zIndex: 48,
        }}
        onClick={() => setIsOpen((open) => !open)}
        aria-label={gu ? "યોજના ડિજિટલ સહાયક" : lang === "hi" ? "योजना डिजिटल सहायक" : "Scheme preview assistant"}
      >
        {isOpen ? <X size={20} /> : <Headphones size={20} />}
      </button>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 768px) {
              button.gov-helpdesk-floating-trigger {
                bottom: calc(var(--nav-h, 68px) + 32px + env(safe-area-inset-bottom)) !important;
                right: 14px !important;
                z-index: 48 !important;
              }
              .gov-helpdesk-floating-panel {
                bottom: calc(var(--nav-h, 68px) + 84px + env(safe-area-inset-bottom)) !important;
                right: 12px !important;
              }
            }
          `,
        }}
      />

      {/* Chat Window Panel */}
      {isOpen && (
        <div
          className="gov-helpdesk-floating-panel"
          style={{ bottom: "calc(var(--nav-h, 68px) + 72px + env(safe-area-inset-bottom))" }}
          role="dialog" aria-modal="true" aria-label={gu ? "દૃષ્ટિ ડિજિટલ સહાયક" : lang === "hi" ? "दृष्टि डिजिटल सहायक" : "Preview assistant"}>
          <div className="ghp-head">
            <div className="ghp-brand">
              <div className="ghp-avatar">
                <Sparkles size={16} />
              </div>
              <div>
                <strong>{gu ? "દૃષ્ટિ ડિજિટલ સહાયક" : lang === "hi" ? "दृष्टि डिजिटल सहायक" : "Drishti AI Assistant"}</strong>
                <small>{gu ? "જાહેર પૂર્વદર્શન · સત્તાવાર માહિતી જોડાયેલી નથી" : lang === "hi" ? "सार्वजनिक पूर्वावलोकन · आधिकारिक जानकारी जुड़ी नहीं है" : "Public preview · official information is not connected"}</small>
              </div>
            </div>
            <button className="ghp-close-btn" onClick={() => setIsOpen(false)} aria-label={gu ? "બંધ કરો" : "Close"}>
              <X size={16} />
            </button>
          </div>

          <div className="ghp-body">
            {messages.map((m) => (
              <div key={m.id} className={`ghp-msg ${m.sender === "user" ? "user-msg" : "bot-msg"}`}>
                <div className="ghp-msg-text">{m.text}</div>
                <div className="ghp-msg-time">{m.timestamp}</div>
                {m.suggestedAction && (
                  <button
                    type="button"
                    className="ghp-action-chip"
                    onClick={() => {
                      onNavigate(m.suggestedAction!.page, m.suggestedAction!.searchTerm);
                      setIsOpen(false);
                    }}
                  >
                    <span>{m.suggestedAction.label}</span>
                    <ChevronRight size={13} />
                  </button>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="ghp-quick-prompts">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                className="ghp-qp-btn"
                onClick={() => handleSend(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            className="ghp-footer"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              placeholder={gu ? "યોજના અથવા પૂર્વદર્શન વિશે પૂછો..." : lang === "hi" ? "योजना या पूर्वावलोकन के बारे में पूछें..." : "Ask about a sample scheme entry..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              aria-label={gu ? "પૂર્વદર્શન સહાયકને પ્રશ્ન પૂછો" : lang === "hi" ? "पूर्वावलोकन सहायक से पूछें" : "Ask the preview assistant"}
            />
            <button type="submit" disabled={!inputText.trim()} aria-label={gu ? "મોકલો" : "Send"}>
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
