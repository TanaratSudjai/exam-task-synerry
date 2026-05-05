import { UserResponse } from "@/types/user/response";

const MOCK_USERS: UserResponse[] = [
    {
        id: 1,
        name: "สมชาย ใจดี",
        email: "somchai@email.com",
        role: "Admin",
        status: "Active",
        createdAt: "2024-01-01T08:30:00Z",
        credit: 1250000.75,
        subRows: [
            { id: 1, field: "เบอร์โทรศัพท์", value: "081-123-4567" },
            { id: 2, field: "สถานะบัญชี", value: "ปกติ" },
            { id: 3, field: "เข้าใช้งานล่าสุด", value: "2026-04-12 14:20" },
        ],
    },
    {
        id: 2,
        name: "สมหญิง รักเรียน",
        email: "somying@email.com",
        role: "Editor",
        status: "Pending",
        createdAt: "2024-02-15T10:15:00Z",
        credit: 8500.00,
        subRows: [
            { id: 1, field: "เบอร์โทรศัพท์", value: "089-987-6543" },
            { id: 2, field: "สถานะบัญชี", value: "รอตรวจสอบ" },
            { id: 3, field: "เข้าใช้งานล่าสุด", value: "2026-04-11 09:45" },
        ],
    },
    {
        id: 3,
        name: "กิตติพงศ์ ตั้งตรง",
        email: "kittipong@email.com",
        role: "Viewer",
        status: "Active",
        createdAt: "2024-03-01T14:20:00Z",
        credit: 45600.50,
        subRows: [
            { id: 1, field: "เบอร์โทรศัพท์", value: "086-111-2233" },
            { id: 2, field: "สถานะบัญชี", value: "ปกติ" },
            { id: 3, field: "เข้าใช้งานล่าสุด", value: "2026-04-10 18:30" },
        ],
    },
    {
        id: 4,
        name: "ณัฐชา พูนทรัพย์",
        email: "natcha@email.com",
        role: "Editor",
        status: "Pending",
        createdAt: "2024-03-15T09:00:00Z",
        credit: 0.00,
        subRows: [
            { id: 1, field: "เบอร์โทรศัพท์", value: "082-333-4455" },
            { id: 2, field: "สถานะบัญชี", value: "รอตรวจสอบ" },
            { id: 3, field: "เข้าใช้งานล่าสุด", value: "2026-04-09 08:10" },
        ],
    },
    {
        id: 5,
        name: "ภัทรดนัย สุขใจ",
        email: "phatdanai@email.com",
        role: "Admin",
        status: "Active",
        createdAt: "2024-04-02T16:45:00Z",
        credit: 999999.99,
        subRows: [
            { id: 1, field: "เบอร์โทรศัพท์", value: "095-777-8899" },
            { id: 2, field: "สถานะบัญชี", value: "ปกติ" },
            { id: 3, field: "เข้าใช้งานล่าสุด", value: "2026-04-08 21:05" },
        ],
    },
    {
        id: 6,
        name: "พิมพ์ชนก แก้วตา",
        email: "pimchanok@email.com",
        role: "Viewer",
        status: "Suspended",
        createdAt: "2024-04-20T11:20:00Z",
        credit: 250.25,
        subRows: [
            { id: 1, field: "เบอร์โทรศัพท์", value: "093-222-1100" },
            { id: 2, field: "สถานะบัญชี", value: "ระงับชั่วคราว" },
            { id: 3, field: "เข้าใช้งานล่าสุด", value: "2026-04-01 11:40" },
        ],
    },
];

export const UserService = {
    getAllUsers: async (): Promise<UserResponse[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MOCK_USERS);
            }, 500);
        });
    },

    searchUsers: async (query: string): Promise<UserResponse[]> => {
        const users = await UserService.getAllUsers();
        if (!query) return users;

        return users.filter(user =>
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase())
        );
    }
};
