import Toastify from 'toastify-js'

// เพิ่ม 'info' และ 'default' เข้าไปใน Type
export const showToast = (
  message: string, 
  type: 'success' | 'error' | 'warning' | 'info' | 'default' = 'success'
) => {

  // กำหนด Palette สีให้ดูสะอาดตาและเป็นมาตรฐาน UI
  const colors = {
    success: "#10b981", // Emerald 500
    error: "#ef4444",   // Red 500
    warning: "#f59e0b", // Amber 500
    info: "#3b82f6",    // Blue 500
    default: "#64748b"  // Slate 500
  };

  Toastify({
    text: message,
    duration: 2500,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: colors[type] || colors.default, // เลือกใช้สีตาม Case
      borderRadius: "6px",
      fontFamily: "var(--font-kanit)",
      fontSize: "14px",
      fontWeight: "400",
      // กำหนด boxShadow เป็น none เพื่อเอาเงาออก
      boxShadow: "none", 
      padding: "12px 20px",
      color: "#ffffff"
    },
    onClick: function(){}
  }).showToast();
}