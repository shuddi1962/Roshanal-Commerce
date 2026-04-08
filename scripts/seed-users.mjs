import { createClient } from "@insforge/sdk";

const insforge = createClient({
  baseUrl: "https://hhmgiq73.us-east.insforge.app",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzODE1NTN9.xryltleRFkmNcEse-Sk63iDhuukaXbMxwv0G_HvFFiw",
});

const users = [
  { email: "admin@roshanalglobal.com", password: "Admin@2026!", name: "Super Admin", role: "super-admin" },
  { email: "customer@roshanalglobal.com", password: "Customer@2026!", name: "John Okafor", role: "customer" },
  { email: "vendor@roshanalglobal.com", password: "Vendor@2026!", name: "Lagos Traders", role: "vendor" },
];

for (const user of users) {
  console.log(`\nRegistering ${user.role}: ${user.email}...`);

  const { data, error } = await insforge.auth.signUp({
    email: user.email,
    password: user.password,
    name: user.name,
  });

  if (error) {
    console.log(`  Error: ${error.message}`);
    continue;
  }

  console.log(`  Registered! User ID: ${data?.user?.id}`);
  console.log(`  Requires verification: ${data?.requireEmailVerification}`);

  if (data?.user?.id) {
    // If we got an access token (no verification required), set profile
    if (data.accessToken) {
      await insforge.auth.setProfile({ role: user.role, phone: "+234 800 000 0000" });
    }
  }
}

console.log("\n--- Done ---");
