# 🔍 LeetCode 33: Search in Rotated Sorted Array

> **Difficulty**: Medium  
> **Topic**: Binary Search / Array Partitioning  
> **Pattern**: Range Eliminator Slider (Sorted Half Identification Invariant)

---

## 📌 Problem Statement (Sawaal Kya Hai?)

Hume ek integer array `nums` diya gaya hai jo originally ascending order mein sorted tha (distinct values ke saath). Is array ko kisi unknown pivot index `k` par rotate kar diya gaya hai (jahan `1 <= k < nums.length`).

For example, array `[0, 1, 2, 4, 5, 6, 7]` agar pivot index 4 par rotate ho jaye, toh ban jaata hai:
`[4, 5, 6, 7, 0, 1, 2]`.

Hume ek `target` value di gayi hai. Hume target ka **index return karna hai** agar target array mein present hai, warna **`-1`** return karna hai.

> ⚠️ **Mandatory Constraint**: Solution **$O(\log N)$ runtime complexity** mein hona chahiye!

---

### 📥 Example Inputs & Outputs

#### Example 1:
- **Input**: `nums = [4, 5, 6, 7, 0, 1, 2]`, `target = 0`
- **Output**: `4` (Index 4 par value `0` hai)

#### Example 2:
- **Input**: `nums = [4, 5, 6, 7, 0, 1, 2]`, `target = 3`
- **Output**: `-1` (Value `3` array mein exist nahi karti)

#### Example 3:
- **Input**: `nums = [1]`, `target = 0`
- **Output**: `-1`

---

## 💡 Core Visual Intuition: The "Always Sorted Half" Invariant

Normal Binary Search tab kaam karta hai jab pura array strictly sorted ho. Lekin jab array rotate hota hai, toh kya Binary Search fail ho jaata hai?

**BILKUL NAHI!** 🎯 Yahan ek powerful mathematical property banti hai:

> 🔑 **Golden Rule of Rotated Array**:  
> Agar hum array ko kisi bhi index `mid` par divide karte hain, toh **dono halves mein se AT LEAST EK HALF 100% SORTED HOGA HI HOGA!**  
> (Either `nums[low ... mid]` is sorted, OR `nums[mid ... high]` is sorted).

```
Array: [ 4,  5,  6,  7,  0,  1,  2 ]
         ▲           ▲           ▲
        low         mid        high

Check Left Half: nums[low] (4) <= nums[mid] (7) ? -> TRUE!
=> Left Half [4, 5, 6, 7] is 100% SORTED!

Ab sawaal poocho: Kya target (0) is sorted range [4 ... 7] ke andar lie karta hai?
target >= 4 && target <= 7 ? -> FALSE!
=> Target left half mein ho hi nahi sakta! Left half ko eliminate kar do: low = mid + 1!
```

---

## 🛠️ Approaches Breakdown

### 🥉 Approach 1: Brute Force (Linear Scan)
- **Soch**: Array par simple `for` loop chalao index `0` se `n-1` tak. Agar `nums[i] === target`, return `i`. Pura loop khatam hone par return `-1`.
- **Time Complexity**: $O(N)$ — Har element ko ek baar check karna padega.
- **Space Complexity**: $O(1)$ — Koi extra memory nahi.
- **Verdict**: Problem $O(\log N)$ maangti hai, isliye interview mein ye solution reject ho jayega.

---

### 🥈 Approach 2: Better (Two-Pass Binary Search — Find Pivot First)
- **Soch**:
  1. **Pass 1**: Modified Binary Search se pehle **inflection point / minimum element (Pivot)** find karo (jahan slope drop hota hai, jaise `7 -> 0`). Isme $O(\log N)$ lagta hai.
  2. **Pass 2**: Pivot milne ke baad array do strictly sorted subarrays mein split ho jaata hai:
     - Left part: `[4, 5, 6, 7]` (from `0` to `pivot - 1`)
     - Right part: `[0, 1, 2]` (from `pivot` to `n - 1`)
  3. Check karo target kis range mein girta hai, aur us specific subarray par standard Binary Search chalao.
- **Time Complexity**: $O(\log N) + O(\log N) = O(\log N)$
- **Space Complexity**: $O(1)$
- **Pros/Cons**: Logically intuitive hai, but do separate binary searches aur boundary edge-cases handle karne padte hain.

---

### 🥇 Approach 3: Optimal (Single-Pass Modified Binary Search — Range Eliminator)
- **Soch**: Do pass karne ki zaroorat hi nahi! Ek single loop mein dynamically identify karo ki kaunsa half sorted hai aur target wahan lie karta hai ya nahi:
  1. `low = 0`, `high = n - 1`.
  2. While `low <= high`:
     - `mid = Math.floor((low + high) / 2)`
     - Agar `nums[mid] === target`, return `mid`!
     - **Check 1: Kya Left Half sorted hai? (`nums[low] <= nums[mid]`)**:
       - Agar haan, aur `target >= nums[low] && target < nums[mid]`:
         Target left half mein hi hai $\rightarrow$ `high = mid - 1`.
       - Warna:
         Target left half mein nahi hai $\rightarrow$ `low = mid + 1`.
     - **Check 2: Warna Right Half sorted hoga (`nums[mid] <= nums[high]`)**:
       - Agar `target > nums[mid] && target <= nums[high]`:
         Target right half mein hi hai $\rightarrow$ `low = mid + 1`.
       - Warna:
         Target right half mein nahi hai $\rightarrow$ `high = mid - 1`.
  3. Agar loop terminate ho jaye, return `-1`.
- **Time Complexity**: $O(\log N)$ (Single Pass Binary Search)
- **Space Complexity**: $O(1)$ (Pure In-Place)
- **Visual Feel**: Range boundaries `[low ... high]` exponentially shrink hoti hain, eliminating half the search space at every step!

---

## 📊 Summary Comparison

| Approach | Time Complexity | Space Complexity | Passes | Interview Verdict |
|---|---|---|---|---|
| **Brute Force** | $O(N)$ | $O(1)$ | 1 | ❌ Rejected (Violates $O(\log N)$ constraint) |
| **Better (Two-Pass BS)** | $O(\log N)$ | $O(1)$ | 2 | ⚠️ Accepted but more code & edge-cases |
| **Optimal (Single-Pass BS)** | $O(\log N)$ | $O(1)$ | 1 | ⭐ **Gold Standard / Best in Class** |

---

Aap kis approach ke saath aage badhna chahte hain? Choose karein taki hum uska detailed `.ts` file, unit tests aur reusable visualizer build karein!
