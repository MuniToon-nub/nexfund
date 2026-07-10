/**
 * Admin Seed Script
 * Creates the first admin user for the NexFund BD platform.
 *
 * Usage: npx ts-node --compiler-options '{"module":"commonjs"}' scripts/seed-admin.ts
 * Or: npx tsx scripts/seed-admin.ts
 *
 * Requires MONGODB_URI in .env.local
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || '';

async function seedAdmin() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not set. Copy .env.local.example to .env.local and configure it.');
    process.exit(1);
  }

  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);

  const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phone: String,
    passwordHash: String,
    role: String,
    isVerified: { type: Boolean, default: true },
    kycStatus: { type: String, default: 'verified' },
    subscriptionTier: { type: String, default: 'premium' },
  }, { timestamps: true });

  const User = mongoose.models.User || mongoose.model('User', UserSchema);

  const adminEmail = 'admin@nexfundbd.com';
  const adminPassword = 'admin123456'; // Change in production!

  const existing = await User.findOne({ email: adminEmail });
  if (existing) {
    console.log('⚠️ Admin user already exists:', adminEmail);
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await User.create({
    name: 'NexFund Admin',
    email: adminEmail,
    phone: '+8801700000000',
    passwordHash,
    role: 'admin',
    isVerified: true,
    kycStatus: 'verified',
    subscriptionTier: 'premium',
  });

  console.log('✅ Admin user created successfully!');
  console.log(`   Email:    ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
  console.log('   ⚠️  Change the password after first login!');

  await mongoose.disconnect();
}

seedAdmin().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
