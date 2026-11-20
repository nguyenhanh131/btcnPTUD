using System.ComponentModel.DataAnnotations;
using System.Linq;
using _31241028417_NguyenHongHanh.Data;

namespace _31241028417_NguyenHongHanh.Validation
{
public class GenreAttribute : ValidationAttribute
{
    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
        // Để trống thì bỏ qua, không kiểm tra
        if (value == null || string.IsNullOrWhiteSpace(value.ToString()))
        {
            return ValidationResult.Success;
        }

        // Nhập chữ thay vì số thì báo lỗi nhẹ nhàng, không văng exception
        if (!int.TryParse(value.ToString(), out int genreID))
        {
            return new ValidationResult(ErrorMessage ?? "Thể loại phải là số ID của Genre");
        }

        var _context = (ApplicationDbContext)validationContext
            .GetService(typeof(ApplicationDbContext));

        if (_context.Genres.Any(x => x.ID == genreID))
        {
            return ValidationResult.Success;
        }

        return new ValidationResult(ErrorMessage ?? "Genre không tồn tại");
    }
}
}