using System;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using _31241028417_NguyenHongHanh.Data;
using _31241028417_NguyenHongHanh.Extension;
using _31241028417_NguyenHongHanh.Models;

namespace _31241028417_NguyenHongHanh.Controllers
{
    public class MoviesController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly IConfiguration _config;

        public MoviesController(ApplicationDbContext context, IWebHostEnvironment env, IConfiguration config)
        {
            _context = context;
            _env = env;
            _config = config;
        }

        // ================== CRUD PHIM ==================

        // GET: Movies (trang chủ, có lọc theo thể loại)
        public async Task<IActionResult> Index(int? genreId)
        {
            var query = _context.Movies.Include(m => m.GenreObj).AsQueryable();
            if (genreId.HasValue)
            {
                query = query.Where(m => m.GenreID == genreId);
            }

            ViewBag.Genres = await _context.Genres.OrderBy(g => g.Name).ToListAsync();
            ViewBag.SelectedGenre = genreId;
            return View(await query.ToListAsync());
        }
        // GET: Movies/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null) return NotFound();

            var movie = await _context.Movies
                .Include(m => m.GenreObj)
                .FirstOrDefaultAsync(m => m.ID == id);
            if (movie == null) return NotFound();

            return View(movie);
        }

        // GET: Movies/Create
        public IActionResult Create()
        {
            ViewData["GenreID"] = new SelectList(_context.Genres, "ID", "Name");
            return View();
        }

        // POST: Movies/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Movie movie)
        {
            if (ModelState.IsValid)
            {
                await SavePictureAsync(movie);
                if (movie.PicturePath == null)
                {
                    movie.PicturePath = "/images/no-image.jpg";
                }

                _context.Add(movie);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }

            ViewData["GenreID"] = new SelectList(_context.Genres, "ID", "Name", movie.GenreID);
            return View(movie);
        }

        // GET: Movies/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            var movie = await _context.Movies.FindAsync(id);
            if (movie == null) return NotFound();

            ViewData["GenreID"] = new SelectList(_context.Genres, "ID", "Name", movie.GenreID);
            return View(movie);
        }

        // POST: Movies/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Movie movie)
        {
            if (id != movie.ID) return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    // Giữ ảnh cũ nếu không upload ảnh mới
                    var oldMovie = await _context.Movies.AsNoTracking()
                        .FirstOrDefaultAsync(m => m.ID == id);

                    await SavePictureAsync(movie);
                    if (movie.PicturePath == null)
                    {
                        movie.PicturePath = oldMovie?.PicturePath ?? "/images/no-image.jpg";
                    }

                    _context.Update(movie);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!MovieExists(movie.ID)) return NotFound();
                    throw;
                }
                return RedirectToAction(nameof(Index));
            }

            ViewData["GenreID"] = new SelectList(_context.Genres, "ID", "Name", movie.GenreID);
            return View(movie);
        }

        // GET: Movies/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null) return NotFound();

            var movie = await _context.Movies
                .Include(m => m.GenreObj)
                .FirstOrDefaultAsync(m => m.ID == id);
            if (movie == null) return NotFound();

            return View(movie);
        }

        // POST: Movies/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var movie = await _context.Movies.FindAsync(id);
            if (movie != null)
            {
                _context.Movies.Remove(movie);
            }
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        // ================== GIỎ HÀNG ==================

        // GET: Movies/AddToCart/5 (thêm vào giỏ rồi quay lại trang đang đứng)
        public ActionResult AddToCart(int id)
        {
            var movie = _context.Movies.FirstOrDefault(x => x.ID == id);
            if (movie == null)
            {
                TempData["Message"] = "Sản phẩm không tồn tại.";
                return RedirectToAction(nameof(Index));
            }

            var hoaDon = HttpContext.Session.Get<HoaDon>("HoaDon");
            var item = hoaDon.ChiTietHoaDons.FirstOrDefault(x => x.MaMovie == id);
            if (item == null)
            {
                hoaDon.ChiTietHoaDons.Add(new ChiTietHoaDon
                {
                    MaMovie = id,
                    MovieObj = movie,
                    SoLuong = 1
                });
            }
            else
            {
                item.SoLuong++;
            }

            TinhTongTien(hoaDon);
            HttpContext.Session.Set("HoaDon", hoaDon);
            TempData["Message"] = $"Đã thêm \"{movie.Title}\" vào giỏ hàng.";

            var referer = Request.Headers["Referer"].ToString();
            if (!string.IsNullOrEmpty(referer))
            {
                return Redirect(referer);
            }
            return RedirectToAction(nameof(Index));
        }

        /// GET: Movies/RemoveFromCart?maMovies=5
        public ActionResult RemoveFromCart(int maMovies)
        {
            var hoaDon = HttpContext.Session.Get<HoaDon>("HoaDon");
            var item = hoaDon.ChiTietHoaDons.FirstOrDefault(x => x.MaMovie == maMovies);
            if (item != null)
            {
                hoaDon.ChiTietHoaDons.Remove(item);
            }

            TinhTongTien(hoaDon);
            HttpContext.Session.Set("HoaDon", hoaDon);
            TempData["Message"] = "Đã xóa sản phẩm khỏi giỏ hàng.";
            return RedirectToAction(nameof(Cart));
        }
        // GET: Movies/Cart (trang giỏ hàng)
        public ActionResult Cart()
        {
            var hoaDon = HttpContext.Session.Get<HoaDon>("HoaDon");
            return View("AddToCart", hoaDon);
        }

        // ================== CHECKOUT ==================

        // GET: Movies/Checkout
        public ActionResult Checkout()
        {
            var hoaDon = HttpContext.Session.Get<HoaDon>("HoaDon");
            if (hoaDon.ChiTietHoaDons.Count == 0)
            {
                TempData["Message"] = "Giỏ hàng đang trống, hãy chọn sản phẩm trước.";
                return RedirectToAction(nameof(Index));
            }

            ViewBag.Cart = hoaDon;
            return View(new ShippingDetail());
        }

        // POST: Movies/Checkout
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Checkout(ShippingDetail detail)
        {
            var hoaDon = HttpContext.Session.Get<HoaDon>("HoaDon");

            if (hoaDon.ChiTietHoaDons.Count == 0)
            {
                ModelState.AddModelError("", "Sorry, your cart is empty!");
            }

            if (!ModelState.IsValid)
            {
                ViewBag.Cart = hoaDon;
                return View(detail);
            }

            // Ngày giao chưa có trên form nên đặt mặc định là hôm nay
            if (detail.ReleaseDate == default)
            {
                detail.ReleaseDate = DateTime.Today;
            }

            // 1. Lưu đơn hàng vào CSDL trước
            var order = new HoaDon
            {
                NgayLap = DateTime.Now,
                TongTien = hoaDon.TongTien
            };
            foreach (var ct in hoaDon.ChiTietHoaDons)
            {
                order.ChiTietHoaDons.Add(new ChiTietHoaDon
                {
                    MaMovie = ct.MaMovie,
                    SoLuong = ct.SoLuong
                });
            }
            _context.HoaDons.Add(order);
            _context.ShippingDetails.Add(detail);
            await _context.SaveChangesAsync();

            // 2. Gửi email sau. Nếu lỗi email, đơn vẫn đã được lưu
            var gmail = _config["Email:Address"];
            var appPassword = _config["Email:AppPassword"];
            if (!string.IsNullOrEmpty(gmail) && !string.IsNullOrEmpty(appPassword))
            {
                await EmailServiceNew.SendMailGoogleSmtp(
                    gmail,
                    detail.Email,
                    "New order submitted!",
                    BuildOrderEmail(hoaDon, detail),
                    gmail,
                    appPassword);
            }

            HttpContext.Session.Remove("HoaDon");
            return View("CheckoutCompleted");
        }

        // ================== HÀM PHỤ ==================

        private bool MovieExists(int id)
        {
            return _context.Movies.Any(e => e.ID == id);
        }

        // Lưu file ảnh vào wwwroot/images và gán đường dẫn cho movie
        private async Task SavePictureAsync(Movie movie)
        {
            if (movie.PictureUpload != null && movie.PictureUpload.Length > 0)
            {
                var imagesFolder = Path.Combine(_env.WebRootPath, "images");
                Directory.CreateDirectory(imagesFolder);

                var fileName = Path.GetFileName(movie.PictureUpload.FileName);
                var path = Path.Combine(imagesFolder, fileName);

                using (var stream = System.IO.File.Create(path))
                {
                    await movie.PictureUpload.CopyToAsync(stream);
                }

                movie.PicturePath = "/images/" + fileName;
            }
        }

        // Tính lại tổng tiền của giỏ hàng
       private static void TinhTongTien(HoaDon hoaDon)
        {
            decimal tong = 0;
            foreach (var ct in hoaDon.ChiTietHoaDons)
            {
                tong += ct.MovieObj.Price * ct.SoLuong;
            }
            hoaDon.TongTien = tong;
        }
        // Soạn nội dung email (HTML, có encode để tránh chèn mã)
        private static string BuildOrderEmail(HoaDon hoaDon, ShippingDetail detail)
        {
            var sb = new StringBuilder();
            sb.Append("<p>A new order has been submitted</p><hr/><p>Items:</p><ul>");

            foreach (var ct in hoaDon.ChiTietHoaDons)
            {
                decimal subtotal = ct.MovieObj.Price * ct.SoLuong;
                sb.Append($"<li>{ct.SoLuong} x {System.Net.WebUtility.HtmlEncode(ct.MovieObj.Title)} (subtotal: {subtotal:N0})</li>");
            }

            sb.Append("</ul>");
            sb.Append($"<p>Total order value: {hoaDon.TongTien:N0}</p><hr/>");
            sb.Append("<p>Ship to:<br/>")
              .Append(System.Net.WebUtility.HtmlEncode(detail.Name)).Append("<br/>")
              .Append(System.Net.WebUtility.HtmlEncode(detail.Address)).Append("<br/>")
              .Append(System.Net.WebUtility.HtmlEncode(detail.Mobile))
              .Append("</p>");

            return sb.ToString();
        }
    }
}