import React from "react";

function Lead() {
  async function handleSubmit(formData: FormData) {
    "use server";
    // event.preventDefault();

    const rawFormData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
    };

    console.log("Sending Form Data:", rawFormData);
    const u = new URLSearchParams(rawFormData).toString();

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbyZD5NyYxR95xUxIyoNHb1xoJe8HYW6gS0R0s7AwblO/dev" + u,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          // body: JSON.stringify(rawFormData),
          redirect: "follow",
        }
      );
      console.log("Result:", response.status);

      if (response.ok) {
        console.log("Result:", response);
      }
    } catch (error) {
      console.error("Error:", error, rawFormData);
    }
  }

  return (
    <div>
      <form action={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" defaultValue="Name" required />
        <label htmlFor="email">Email: </label>
        <input
          type="email"
          id="email"
          name="email"
          defaultValue="try.srivastava4nishant@gmail.com"
          required
        />
        <label htmlFor="phone">Phone:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          defaultValue="04850"
          required
        />
        <input type="submit" />
      </form>
    </div>
  );
}

export default Lead;
