"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitWaitlist(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const city = formData.get("city") as string;
    const classLevel = formData.get("class") as string;
    const type = (formData.get("type") as string) || "STUDENT";

    if (!name || !phone || !city) {
      return { success: false, error: "Name, Phone and City are required." };
    }

    // Check if already exists
    const existing = await prisma.waitlist.findFirst({
      where: { phone }
    });

    if (existing) {
      return { success: false, error: "You're already on the waitlist! We'll contact you soon." };
    }

    await prisma.waitlist.create({
      data: {
        name,
        phone,
        city,
        class: classLevel,
        type,
      }
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Waitlist Error:", error);
    return { success: false, error: "Database failure. Powering down..." };
  }
}

export async function submitSchoolLead(formData: FormData) {
  try {
    const schoolName = formData.get("name") as string;
    const city = formData.get("city") as string;
    const contact = formData.get("contact") as string;

    if (!schoolName || !city || !contact) {
        return { success: false, error: "All fields are required for school partnership." };
    }

    await prisma.waitlist.create({
      data: {
        name: schoolName,
        city,
        phone: contact,
        type: "SCHOOL",
        message: "School Partnership Inquiry"
      }
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("School Lead Error:", error);
    return { success: false, error: "System failure. Retrying mission..." };
  }
}
