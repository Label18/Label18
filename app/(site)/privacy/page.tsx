export default function PrivacyPolicy() {
  return (
    <main className="w-full min-h-screen bg-[#F8F6F0] text-[#1A1A1A] selection:bg-[#d4af37]/30 selection:text-[#1A1A1A]">

      {/* Premium Hero Section */}
      <section className="relative w-full h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden border-b border-[#1A1A1A]/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#f3efe6] via-[#F8F6F0] to-[#EAE5D9]"></div>
        <div className="absolute inset-0 bg-[#9c7d23]/5 mix-blend-overlay"></div>

        <div className="relative z-10 text-center flex flex-col items-center px-4 mt-12">
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-[#9c7d23]/50 mb-6"></div>
          <span className="font-outfit font-light text-[10px] tracking-[0.5em] uppercase text-[#9c7d23] mb-4">
            Legal & Policies
          </span>
          <h1 className="font-normal text-4xl md:text-6xl text-[#1A1A1A] tracking-widest uppercase" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
            Privacy <span className="text-[#9c7d23] italic font-normal tracking-normal lowercase" style={{ fontFamily: '"Times New Roman", Times, serif' }}>Policy</span>
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="w-full flex justify-center py-20 px-6 lg:px-16">
        <div className="w-full max-w-4xl font-outfit font-light text-[#1A1A1A]/70 leading-[2.2] tracking-wide text-sm md:text-base space-y-16">

          <div className="prose max-w-none">
            <p className="text-xl md:text-2xl italic text-[#1A1A1A]/90 leading-relaxed text-center mb-16" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
              &ldquo;Your privacy is of the utmost importance to us. The 18 Label is committed to ensuring that your personal information is protected and respected.&rdquo;
            </p>
          </div>

          {[
            {
              title: "Information We Collect",
              content: "We may collect personal information such as your name, email address, phone number, shipping and billing addresses, and payment details when you make a purchase, create an account, or contact us. We also automatically collect certain information about your device, including your IP address, browser type, and interactions with our website through cookies and similar technologies."
            },
            {
              title: "How We Use Your Information",
              content: "The 18 Label uses your personal information to process and fulfil your orders, communicate with you regarding your purchases or inquiries, and provide a personalised shopping experience. We may also use this information to send you promotional offers and updates, provided you have opted in to receive such communications."
            },
            {
              title: "Sharing of Information",
              content: "We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted third-party service providers (such as payment gateways and courier partners) solely for the purpose of processing your transactions and delivering your orders. We may also disclose information if required by law or to protect our rights and safety."
            },
            {
              title: "Cookies and Tracking",
              content: "Our website uses cookies to enhance your browsing experience, remember your preferences, and analyse site traffic. You can choose to disable cookies through your browser settings, though this may affect certain functionalities of the website."
            },
            {
              title: "Data Security",
              content: "We implement appropriate technical and organisational measures to safeguard your personal information against unauthorised access, alteration, disclosure, or destruction. However, please note that no method of transmission over the internet or electronic storage is 100% secure."
            },
            {
              title: "Your Rights",
              content: "You have the right to access, update, or request the deletion of your personal information held by us. If you wish to exercise any of these rights, or if you have any questions about how your data is handled, please contact us."
            },
            {
              title: "Updates to this Policy",
              content: "The 18 Label may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. The updated policy will be posted on this page with the effective date."
            },
            {
              title: "Contact Us",
              content: "If you have any questions or concerns regarding this Privacy Policy or our data practices, please reach out to us using the contact details provided in our footer."
            }
          ].map((section, idx) => (
            <div key={idx} className="relative pl-8 md:pl-12 border-l border-[#1A1A1A]/15 group hover:border-[#9c7d23] transition-colors duration-500">
              <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#F8F6F0] border border-[#1A1A1A]/30 group-hover:border-[#9c7d23] group-hover:bg-[#9c7d23]/20 transition-all duration-500"></span>
              <h2 className="text-xl md:text-2xl text-[#1A1A1A] tracking-widest mb-4 font-normal" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                <span className="text-[#9c7d23] mr-4 font-outfit text-sm font-medium">{String(idx + 1).padStart(2, '0')}</span>
                {section.title}
              </h2>
              <p className="text-[#1A1A1A]/7owy">{section.content}</p>
            </div>
          ))}

        </div>
      </section>

    </main>
  );
}