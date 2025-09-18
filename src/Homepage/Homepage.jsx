import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
const items = [
  {
    title: 'वर्गिकरण भनेको के हो?',
    body:
      'जग्गाको वर्गिकरण भन्नाले जमिनलाई कानूनी, प्रशासनिक वा प्राविधिक हिसाबले कुन प्रयोजनका लागि प्रयोग गर्ने भनेर छुट्याउने प्रक्रिया हो। यसले भूमि प्रयोग, कर निर्धारण, योजना र विकास कार्यमा मार्गदर्शन गर्छ।',
  },
  {
    title: 'स्थानीय सरकारले भूमि उपयोग नियमावली अनुसार गर्छ',
    body:
      'जग्गाको प्रयोग र वर्ग निर्धारण स्थानीय तह (नगरपालिका / गाउँपालिका) ले नेपाल सरकारको भूमि उपयोग नीति र नियमावलीका मापदण्ड अनुसार गर्छन्। नापी, मालपोत, र नगर/गाउंले बनाएको ल्यान्ड युज प्लानमा यी वर्गहरु स्पष्ट हुन्छन्।',
  },
  {
    title: 'मुख्य वर्गहरु (सङ्क्षेप)',
    body:
      '१. कृषि, २. आवासीय, ३. व्यापारिक, ४. औद्योगिक, ५. सार्वजनिक, ६. वन/संरक्षण, ७. जलाशय/नदी-नाला, ८. जोखिमयुक्त क्षेत्रहरु र ९. पर्यटन/सांस्कृतिक क्षेत्र। स्थानीय नियमन अनुसार अघि थप श्रेणीहरू अपनाउन सकिन्छ।',
  },
  {
    title: 'वर्गिकरणको महत्व',
    body:
      '• कर निर्धारण फरक-फरक हुन्छ।\n• योजना र पूर्वाधार (सडक, पानी, बत्ती) व्यवस्थापन सजिलो हुन्छ।\n• प्रयोग परिवर्तन (जस्तै कृषि → आवासीय)का लागि अनुमति र कार्यविधि आवश्यक पर्छ।\n• वातावरणीय जोखिम (पहिरो, बाढी) व्यवस्थापनमा सहयोगी हुन्छ।',
  }
];


const Homepage = () => {
const toggle = (i) => setOpenIndex(openIndex === i ? null : i);
const navigate = useNavigate()
const [openIndex, setOpenIndex] = useState(null);
  return (
    <section className="container my-4">
      <h2 className="text-center text-primary mb-4">जग्गाको वर्गिकरण</h2>

      <div className="accordion" id="accordionExample">
        {items.map((item, i) => (
          <div className="accordion-item mb-2 shadow-sm rounded" key={i}>
            <h2 className="accordion-header">
              <button
                className={`accordion-button ${openIndex === i ? '' : 'collapsed'}`}
                type="button"
                onClick={() => toggle(i)}
              >
                {item.title}
              </button>
            </h2>
            <div
              className={`accordion-collapse collapse ${openIndex === i ? 'show' : ''}`}
            >
              <div className="accordion-body text-secondary">
                {item.body.split('\n').map((line, idx) => (
                  <p key={idx} className="mb-1">{line}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <button
          className="btn btn-primary btn-lg px-4"
          onClick={() => navigate('/search')}
        >
          वर्गिकरण हेर्न यहाँ थिच्नुहोस्
        </button>
      </div>
      <div className="text-center mt-4">
        <button
          className="btn btn-primary btn-lg px-4"
          onClick={() =>navigate("/admin")}
        >
          एडमिनका लागि यहाँ थिच्नुहोस्
        </button>
      </div>
    </section>
  )
}

export default Homepage
