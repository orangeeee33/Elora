import {
  useState,
  type FormEvent,
} from "react";


function Contact() {

  const [showForm, setShowForm] =
    useState(false);

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();

    setError("");


    if (
      !name.trim() ||
      !phone.trim() ||
      !message.trim()
    ) {

      setError(
        "Please complete all fields."
      );

      return;
    }


    const whatsappNumber =
      import.meta.env.VITE_WHATSAPP_NUMBER;


    if (!whatsappNumber) {

      setError(
        "WhatsApp number is not configured."
      );

      return;
    }


    const whatsappMessage = `
Hello ELORA ✨

Name: ${name.trim()}
Phone: ${phone.trim()}

Message:
${message.trim()}
    `.trim();


    const whatsappUrl =
      `https://wa.me/${whatsappNumber}` +
      `?text=${encodeURIComponent(
        whatsappMessage
      )}`;


    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );

  };


  return (

    <section
      id="contact"
      className="contact-section"
    >

      <div
        className={`contact-slider ${
          showForm ? "show-form" : ""
        }`}
      >

        {/* ==================================
            INTRO SCREEN
        ================================== */}

        <div className="contact-screen contact-welcome">

          <p className="contact-small">
            WE’RE HERE FOR YOU
          </p>

          <h2 className="contact-welcome-title">
            LET’S
            <span> TALK</span>
          </h2>

          <p className="contact-description">
            Have a question about a piece,
            delivery, or your order?
            We’d love to hear from you.
          </p>


          <button
            type="button"
            className="contact-open-button"
            onClick={() => {
              setShowForm(true);
              setError("");
            }}
          >
            GET IN TOUCH
            <span>→</span>
          </button>


          <div className="contact-details">

            <div>

              <span>
                RESPONSE TIME
              </span>

              <strong>
                Usually within a few hours
              </strong>

            </div>


            <div>

              <span>
                WORKING HOURS
              </span>

              <strong>
                Monday – Saturday
                <br />
                10:00 AM – 7:00 PM
              </strong>

            </div>

          </div>

        </div>


        {/* ==================================
            FORM SCREEN
        ================================== */}

        <div className="contact-screen contact-form-screen">

          <button
            type="button"
            className="contact-back-button"
            onClick={() => {
              setShowForm(false);
              setError("");
            }}
          >
            <span>←</span>
            BACK
          </button>


          <div className="contact-form-header">

            <p className="contact-small">
              SEND US A MESSAGE
            </p>

            <h2>
              GET IN
              <span> TOUCH</span>
            </h2>

            <p className="contact-description">
              Complete the form and continue
              your conversation on WhatsApp.
            </p>

          </div>


          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >

            <div className="contact-field">

              <label htmlFor="contact-name">
                FULL NAME
              </label>

              <input
                id="contact-name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                autoComplete="name"
                required
              />

            </div>


            <div className="contact-field">

              <label htmlFor="contact-phone">
                PHONE NUMBER
              </label>

              <input
                id="contact-phone"
                type="tel"
                placeholder="+961..."
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
                autoComplete="tel"
                required
              />

            </div>


            <div className="contact-field">

              <label htmlFor="contact-message">
                MESSAGE
              </label>

              <textarea
                id="contact-message"
                placeholder="How can we help you?"
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                required
              />

            </div>


            {error && (

              <p
                className="contact-error"
                role="alert"
              >
                {error}
              </p>

            )}


            <button
              type="submit"
              className="contact-submit"
            >
              SEND ON WHATSAPP
              <span>↗</span>
            </button>

          </form>

        </div>

      </div>

    </section>

  );

}


export default Contact;