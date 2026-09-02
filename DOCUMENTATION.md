# NR Accessories - System Documentation & Guide

මෙම ලියවිල්ල මගින් nr-accessories.lk වෙබ් අඩවිය භාවිතා කරන ආකාරය සහ කේතය (code) හසුරුවන ආකාරය පිළිබඳව සම්පූර්ණ විස්තරයක් ලබා දේ. මෙය වෙනත් තැනක Save කර තබා ගන්න.

---

## 1. Admin Login Details (ඇඩ්මින් ගිණුම් විස්තර)

වෙබ් අඩවියේ භාණ්ඩ සහ පරිශීලකයින් කළමනාකරණය කිරීම සඳහා පහත Admin ගිණුම භාවිතා කරන්න.

- **Email:** `admin@nr-accessories.lk`
- **Password:** `admin123`

*(මෙම ගිණුමෙන් ලොග් වූ පසු ඔබට වෙබ් අඩවියේ Admin කොටසට පිවිසිය හැක.)*

---

## 2. System එක Run කරන ආකාරය (NPM Commands)

සයිට් එකේ Frontend (UI) සහ Backend (Server) කොටස් දෙකම වෙන වෙනම Run කළ යුතුය.

### පියවර 1: Backend එක Run කිරීම
1. Terminal එකක් විවෘත කර Backend folder එකට යන්න.
   `cd server`
2. අලුත් packages මොනවා හරි තියෙනවා නම් ඒවා install කරන්න.
   `npm install`
3. Server එක start කරන්න.
   `npm run dev`
   *(මෙය `http://localhost:5001` හි ක්‍රියාත්මක වනු ඇත.)*

### පියවර 2: Frontend එක Run කිරීම
1. තවත් අලුත් Terminal එකක් විවෘත කර Frontend folder එකට යන්න.
   `cd frontend`
2. Packages install කරන්න.
   `npm install`
3. React/Vite සයිට් එක start කරන්න.
   `npm run dev`
   *(මෙය `http://localhost:5173` හි ක්‍රියාත්මක වනු ඇත.)*

---

## 3. Users ලා ඇතුලත් කිරීම සහ Login වීම (User Management)

### Site එකෙන් කරන ආකාරය:
- **Sign Up (ගිණුමක් සෑදීම):** ඕනෑම කෙනෙක්ට වෙබ් අඩවියට ගිහින් "Sign in / User" අයිකන් එක ඔබලා "Create account" හරහා අලුත් ගිණුමක් සාදාගත හැක.
- **Login (ලොග් වීම):** "Sign in" පිටුවට ගොස් Email එක සහ Password එක දී ලොග් විය හැක.

### Code එකෙන් (Backend) වෙන විදිහ:
- **Routes:** `/api/auth/register` සහ `/api/auth/login` යන endpoints වලින් තමයි මේ දේවල් සිද්ධ වෙන්නේ. 
- **Code එක තියෙන තැන:** `server/controllers/authController.js` ෆයිල් එකේ තමයි users ලාව database (MongoDB) එකට save කරන එක සහ login වෙද්දී password එක (bcrypt හරහා) check කරලා token එකක් (JWT) දෙන එක ලියලා තියෙන්නේ.

---

## 4. Products කළමනාකරණය කිරීම (Product Management)

### Site එකෙන් කරන ආකාරය:
1. මුලින්ම උඩ තියෙන `admin@nr-accessories.lk` ගිණුමෙන් ලොග් වෙන්න.
2. ලොග් වුණාට පස්සේ Admin Panel එකට (හෝ `/admin/products` route එකට) යන්න පුළුවන්.
3. එතනින් අලුත් Products ඇතුලත් කරන්න (Add), තියෙන ඒවා වෙනස් කරන්න (Edit), සහ මකා දාන්න (Delete) පුළුවන්.

### Code එකෙන් වෙන විදිහ:
- **Routes:** `/api/products` (GET, POST, PUT, DELETE)
- **Code එක තියෙන තැන:** `server/controllers/productController.js`
- **Frontend Code:** `frontend/src/pages/AdminProducts.tsx` සහ `frontend/src/components/Admin/ProductFormModal.tsx` යන ෆයිල්ස් වල තමයි Admin ගේ UI එක හදලා තියෙන්නේ.

---

## 5. අමතර වැදගත් දේවල් (Important Notes to Remember)

> [!WARNING]  
> **Stripe Payment Gateway:** දැනට Checkout එකේ "Card payment" තෝරලා තියෙන්නේ **Test Mode** එකෙන්. ඇත්තටම සල්ලි කැපෙන්නේ නැහැ. Test කරලා බලන්න `4242 4242 4242 4242` කියන කාඩ් නම්බර් එක පාවිච්චි කරන්න පුළුවන්. අනාගතයේදී මේක Live දාන්න නම් Stripe එකේ Live API keys, Backend එකේ `.env` ෆයිල් එකට දාන්න ඕනේ.

> [!TIP]  
> **Database:** මේකේ Database එක විදිහට පාවිච්චි කරන්නේ MongoDB. ඔක්කොම දත්ත (Users, Orders, Products) තියෙන්නේ එතන. `.env` ෆයිල් එකේ `MONGO_URI` එක වෙනස් කරොත් වෙන Database එකකට සම්බන්ධ කරන්න පුළුවන්.

> [!IMPORTANT]  
> **Github හෝ Hosting:** මේක අනාගතයේදී Vercel, Netlify හෝ Render වගේ තැනකට Host කරනවා නම්, Frontend එකේ `npm run build` කරලා ගන්න `dist` ෆෝල්ඩර් එක තමයි පාවිච්චි කරන්න ඕනේ. ඒ වගේම Frontend එකේ `VITE_API_URL` කියන environment variable එකට Backend එක host කරන තැන URL එක දෙන්න මතක තබාගන්න.
