"use server";
export async function handleSubmit(formData: FormData) {
  const rawFormData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
  };

  console.log("Sending Form Data:", JSON.stringify(rawFormData));

  if (process.env.NODE_ENV === "production") {
    try {
      const response = await fetch(process.env.AppscriptUrl as string, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(rawFormData),
        redirect: "follow",
      });
      console.log("Result:", response.status);

      if (response.ok) {
        console.log("Result:", await response.text());
      }
    } catch (error) {
      console.error("Error:", error, rawFormData);
    }
  } else {
    console.log("Not in production :(");
  }
}
