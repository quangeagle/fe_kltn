# 📊 Template Excel cho Hệ thống Dự đoán

## 🎯 **Cấu trúc file Excel cần thiết:**

### **Sheet 1 - Dữ liệu dự đoán (3 hàng)**

#### **Hàng 1: Doanh thu 10 tuần gần nhất**
```
| A1 | B1 | C1 | D1 | E1 | F1 | G1 | H1 | I1 | J1 |
|----|----|----|----|----|----|----|----|----|----|
|1000|1200|1100|1300|1400|1250|1350|1500|1600|1700|
```
**Mô tả:** Doanh thu theo tuần, từ tuần xa nhất (T1) đến tuần gần nhất (T10)

#### **Hàng 2: Yếu tố bên ngoài (Tuần trước)**
```
| A2 | B2 | C2 | D2 |
|----|----|----|----|
| 25 |2.5 |105 |5.2 |
```
**Mô tả:** 
- A2: Nhiệt độ tuần trước (°C)
- B2: Giá xăng tuần trước ($)
- C2: Chỉ số CPI tuần trước
- D2: Tỷ lệ thất nghiệp tuần trước (%)

#### **Hàng 3: Yếu tố bên ngoài (Tuần hiện tại)**
```
| A3 | B3 | C3 | D3 | E3 | F3 | G3 | H3 | I3 | J3 |
|----|----|----|----|----|----|----|----|----|----|
| 0  | 26 |2.6 |106 |5.1 | 4  | 15 |2024|  2  |  0  |
```
**Mô tả:**
- A3: Cờ ngày lễ (0 = không, 1 = có)
- B3: Nhiệt độ hiện tại (°C)
- C3: Giá xăng hiện tại ($)
- D3: Chỉ số CPI hiện tại
- E3: Tỷ lệ thất nghiệp hiện tại (%)
- F3: Tháng (1-12)
- G3: Tuần trong năm (1-53)
- H3: Năm
- I3: Ngày trong tuần (1-7, 1 = Thứ 2)
- J3: Cờ cuối tuần (0 = không, 1 = có)

## ⚠️ **Quy tắc quan trọng:**

1. **KHÔNG có header** - dữ liệu bắt đầu từ ô A1
2. **Thứ tự cột phải chính xác** - không được thay đổi
3. **Dữ liệu phải là số** - không text, không ký tự đặc biệt
4. **Không được bỏ trống** - điền đầy đủ tất cả ô
5. **Định dạng file:** .xlsx (Excel 2007+)

## 📥 **Cách sử dụng:**

1. Tải file Excel theo template trên
2. Điền dữ liệu thực tế vào các ô tương ứng
3. Lưu file với định dạng .xlsx
4. Upload vào hệ thống dự đoán
5. Hệ thống sẽ tự động đọc và xử lý

## 🔍 **Ví dụ dữ liệu thực tế:**

```
| A1 | B1 | C1 | D1 | E1 | F1 | G1 | H1 | I1 | J1 |
|----|----|----|----|----|----|----|----|----|----|
|1500|1600|1700|1800|1900|2000|2100|2200|2300|2400|

| A2 | B2 | C2 | D2 |
|----|----|----|----|
| 28 |3.2 |108 |4.8 |

| A3 | B3 | C3 | D3 | E3 | F3 | G3 | H3 | I3 | J3 |
|----|----|----|----|----|----|----|----|----|----|
| 0  | 30 |3.3 |109 |4.7 | 5  | 20 |2024|  3  |  0  |
```

## ❌ **Lỗi thường gặp:**

- **Thiếu cột:** Hệ thống sẽ báo lỗi "worksheet.length < 3"
- **Sai thứ tự:** Dữ liệu sẽ bị đọc nhầm
- **Dữ liệu text:** Hệ thống không thể xử lý
- **Ô trống:** Có thể gây lỗi khi gọi API
