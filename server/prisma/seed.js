const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const adminEmail = 'admin@company.com';
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await prisma.user.create({
            data: {
                name: 'Admin User',
                email: adminEmail,
                password: hashedPassword,
                role: 'ADMIN',
                status: 'ACTIVE'
            }
        });
        console.log('Admin user created');
    }

    const staffEmail = 'staff@company.com';
    const existingStaff = await prisma.user.findUnique({ where: { email: staffEmail } });

    if (!existingStaff) {
        const hashedPassword = await bcrypt.hash('staff123', 10);
        await prisma.user.create({
            data: {
                name: 'John Staff',
                email: staffEmail,
                password: hashedPassword,
                role: 'STAFF',
                status: 'ACTIVE'
            }
        });
        console.log('Staff user created');
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
