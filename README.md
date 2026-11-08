# User Dashboard (React)

SPA sederhana untuk menampilkan daftar pengguna dari API publik (JSONPlaceholder), dengan pencarian realtime client-side dan detail pengguna dalam modal.

## Cara Menjalankan

```bash
# 1. Clone repository
git clone <repo-url>
cd frontend-test

# 2. Siapkan environment
cp .env.example .env

# 3. Install dependensi
npm install

# 4. Jalankan server
npm run dev
```

Isi `.env`:

```bash
VITE_API_URL=https://jsonplaceholder.typicode.com
```

## Struktur Project

```
├── index.html                    
├── vite.config.js                
├── .env                          
├── .env.example                  
└── src/
    ├── main.jsx                  
    ├── index.css                 
    ├── App.jsx                   
    ├── api/
    │   └── user.js               
    └── components/
        ├── search-bar.jsx         
        ├── table-user.jsx         
        ├── user-detail-modal.jsx 
        └── user-detail-card.jsx 
```

## Jawab Pertanyaan Wajib
### Soal 1:
**State Management & Lifecycle:** Bagaimana cara Anda melakukan fetching data di React? Jika Anda menggunakan useEffect, jelaskan bagaimana cara Anda mencegah terjadinya memory leak atau pemanggilan API berulang (infinite loop).

### Jawab:
**a. Cara melakukan fetching data**

Saya menggunakan `useEffect` untuk mengambil data user ketika komponen `UserTable` pertama kali ditampilkan.

Alur fetching data pada `src/components/table-user.jsx`:

1. Komponen melakukan mount, kemudian `useEffect` dijalankan.
2. Effect membuat `AbortController` untuk mengontrol pembatalan request.
3. Fungsi `loadUsers()` dipanggil dan mengubah status menjadi `loading`.
4. Frontend memanggil `userFetch()` dari `src/api/user.js` dengan meneruskan `signal` dari `AbortController`.
5. Jika berhasil, response divalidasi untuk memastikan datanya berupa array, kemudian disimpan menggunakan `setUsers()` dan status menjadi `success`.
6. Jika terjadi error, status diubah menjadi `error`. Error akibat pembatalan request diabaikan.
7. Ketika komponen unmount, fungsi cleanup menjalankan `controller.abort()` untuk membatalkan request yang masih berjalan.

Contoh implementasi (`src/components/table-user.jsx`):

```jsx
useEffect(() => {
  const controller = new AbortController();

  async function loadUsers () {
    setStatus("loading");

    try {
      const payload = await userFetch({ signal: controller.signal });

      if (!Array.isArray(payload)) {
        throw new Error("Unexpected user response.");
      }

      if (controller.signal.aborted) return;

      setUsers(
        payload.filter(
          (user) => user && typeof user === "object",
        ),
      );
      setStatus("success");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      setUsers([]);
      setStatus("error");
    }
  }

  loadUsers();

  return () => controller.abort();
}, []);
```

**b. Bagaimana mencegah memory leak?**

Saya menggunakan `AbortController` dan fungsi cleanup pada `useEffect` untuk mencegah request yang sudah tidak diperlukan tetap berjalan.

Ada beberapa mekanisme yang diterapkan:

1. **Cleanup:** `controller.abort()` membatalkan request ketika komponen unmount.
2. **Abort Guard:** `controller.signal.aborted` memastikan hasil request yang sudah dibatalkan tidak digunakan untuk memperbarui state.
3. **Error Handling:** `AbortError` diabaikan karena pembatalan request merupakan kondisi yang disengaja, bukan kegagalan API.

Dengan cara ini, aplikasi menghindari pemrosesan response yang sudah tidak dibutuhkan dan mencegah update state dari request yang sudah dibatalkan.

Catatan: `AbortController` membatalkan request di sisi client. Ini tidak selalu berarti proses yang sudah diterima server ikut berhenti.

**c. Bagaimana mencegah infinite loop atau fetching berulang?**

Saya mengatur dependency array pada `useEffect` menggunakan `[]`.

```jsx
useEffect(() => {
  const controller = new AbortController();

  loadUsers();

  return () => controller.abort();
}, []);
```

Beberapa hal yang mencegah pemanggilan API berulang:

1. **Dependency Array Kosong (`[]`):** Effect hanya dijalankan saat komponen melakukan mount, bukan setiap kali state berubah.
2. **Fungsi Fetch di dalam Effect:** `loadUsers()` didefinisikan di dalam effect sehingga tidak perlu menjadi dependency tambahan.
3. **API Function Stabil:** `userFetch` di-import dari file modul, sehingga referensinya tidak dibuat ulang setiap render.
4. **Pemisahan Fetching dan Search:** Pencarian user hanya memfilter data yang sudah tersedia di state. Perubahan input pencarian tidak memicu request API baru.

---

### Soal 2:
**Struktur Folder:** Mengapa Anda menstrukturisasi folder/file seperti yang ada di project Anda saat ini? Jelaskan alasannya.

### Jawab:

Struktur folder proyek:
```text
src/
├── api/
│   └── user.js
├── components/
│   ├── search-bar.jsx
│   ├── user-detail-card.jsx
│   ├── user-detail-modal.jsx
│   └── table-user.jsx
├── App.jsx
├── main.jsx
└── index.css
```

Alasan pembagian struktur folder:

1. **`api/` – Pemisahan komunikasi API**

   Digunakan untuk memisahkan proses komunikasi HTTP dari komponen UI. URL endpoint, konfigurasi request, dan proses pengambilan data dikelola di satu tempat. Dengan demikian, perubahan endpoint atau konfigurasi API tidak perlu mengubah setiap komponen yang menggunakan data tersebut.

2. **`components/` – Pemisahan komponen UI**

   Digunakan untuk membagi antarmuka menjadi komponen-komponen kecil berdasarkan tanggung jawabnya.

   - `search-bar.jsx`: Menangani input pencarian.
   - `table-user.jsx`: Mengelola state, fetching data, dan menampilkan tabel user.
   - `user-detail-card.jsx`: Menampilkan informasi detail user.
   - `user-detail-modal.jsx`: Mengatur tampilan modal untuk detail user.

   Pemisahan ini membuat komponen lebih mudah digunakan kembali, diuji, dan dipelihara.

3. **`App.jsx` – Komponen utama aplikasi**

   Berfungsi sebagai tempat menyusun komponen utama dan mengelola state yang dibutuhkan bersama, seperti `searchQuery`. Dengan mengangkat state ke komponen induk (*state lifting*), `SearchBar` dapat memperbarui nilai pencarian, sedangkan `TableUser` menggunakan nilai tersebut untuk memfilter data.

4. **`main.jsx` – Entry point aplikasi**

   Menjadi titik awal untuk merender aplikasi React ke dalam DOM serta memasang konfigurasi global yang diperlukan.

5. **`index.css` – Pengelolaan styling global**

   Menyimpan styling global dan variabel CSS (*design tokens*) seperti warna di dalam `:root`. Komponen menggunakan variabel tersebut agar konsistensi tampilan terjaga dan perubahan tema dapat dilakukan dari satu tempat.

### Soal 3:
**Optimasi Kinerja (Performance):** Anggaplah API tiba-tiba mengembalikan 10.000 data user sekaligus dan membuat aplikasi lag saat diketik di kolom pencarian. Pendekatan apa (fitur React apa) yang akan Anda gunakan untuk mengatasi lag tersebut?

### Jawab:

**Permasalahan:**

Ketika API mengembalikan 10.000 data user sekaligus, proses pencarian dapat menyebabkan lag karena React harus memfilter data dan memperbarui tampilan setiap kali user mengetik.

**Solusi: Menggunakan `useDeferredValue`**

Saya menggunakan `useDeferredValue` untuk menunda pembaruan nilai pencarian yang digunakan oleh daftar user, sehingga input pencarian tetap responsif meskipun proses filtering membutuhkan waktu lebih lama.

Contoh implementasi, memakai filter yang sama dengan `src/components/table-user.jsx`:

```jsx
const deferredQuery = useDeferredValue(
  normalizedSearchQuery
);

const filteredUsers = deferredQuery
  ? users.filter((user) => {
      const name = String(user.name ?? "").toLowerCase();
      const email = String(user.email ?? "").toLowerCase();

      return (
        name.includes(deferredQuery) ||
        email.includes(deferredQuery)
      );
    })
  : users;
```

**Bagaimana cara kerjanya?**

1. Ketika user mengetik, nilai input diperbarui secara langsung sehingga tidak terasa tertahan.
2. `useDeferredValue` mempertahankan nilai pencarian sebelumnya sementara React memprioritaskan update input.
3. Setelah itu, React memproses pencarian menggunakan nilai terbaru dengan prioritas lebih rendah.
4. Jika user kembali mengetik sebelum proses rendering selesai, React dapat menghentikan pekerjaan rendering yang belum selesai dan memprioritaskan update terbaru.

Dengan demikian, proses pencarian tidak menghambat interaksi user dengan input.