# Problem Explanation: Maximum Subarray (Kadane's Algorithm) — LeetCode 53 📊

Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and return *its sum*.

Also, track the exact **starting and ending indices** `[startIndex, endIndex]` of the subarray that yields this maximum sum.

---

## 📌 Problem Constraints
- `1 <= nums.length <= 10^5`
- `-10^4 <= nums[i] <= 10^4`

---

## 🧠 Approach 1: Brute Force Approach (Check All Subarrays with 3 Loops)

### 💡 Intuition & Logic (Why & How)
Array ke saare possible contiguous subarrays generate karo using outer loop `i` (start index) aur inner loop `j` (end index). Har subarray `nums[i...j]` ka sum calculate karne ke liye ek 3rd loop chalao.

### ⏱️ Complexity Analysis
- **Time Complexity**: `O(N^3)` — 3 nested loops (Too slow for `N = 10^5`, TLE).
- **Space Complexity**: `O(1)` — Extra memory needed nahi hai.

---

## 🧠 Approach 2: Better Approach (O(N^2) Two Loops)

### 💡 Intuition & Logic (Why & How)
Brute force ko optimize karne ke liye, jab hum `j` ko increment karte hain, toh har baar naye loop se sum calculate karne ki bajaye running sum mein `nums[j]` add karte jao: `sum = sum + nums[j]`.

### ⏱️ Complexity Analysis
- **Time Complexity**: `O(N^2)` — 2 nested loops (Will still TLE for `N = 10^5`).
- **Space Complexity**: `O(1)`.

---

## 🧠 Approach 3: Optimal Approach (Kadane's Algorithm — Single Pass O(N)) 🌟

### 💡 Intuition & Logic (Why & How)
Kadane's Algorithm ek greedy strategy hai jo simple rule par kaam karti hai:
> **"Agar kisi prefix subarray ka sum negative (< 0) ho jata hai, toh woh aage kisi bhi subarray sum ko BADHAYEGA NAHI, balkan GHATAYEGA! Isliye negative sum ko aage carry karne ki bajaye sum ko 0 par reset kar do."**

### 🔄 Algorithm Steps:
Initialize: `maxSum = -Infinity`, `sum = 0`, `startIndex = 0`, `endIndex = 0`, `tempStart = 0`

Iterate through `i = 0` to `n - 1`:
1. `sum += nums[i]` (Current element ko running sum mein add karo).
2. If `sum > maxSum`:
   - `maxSum = sum`
   - Update maximum subarray boundaries: `startIndex = tempStart`, `endIndex = i`.
3. If `sum < 0`:
   - Reset `sum = 0` (Discard current negative prefix!).
   - Set `tempStart = i + 1` (New candidate subarray starts from next index).

### ⏱️ Complexity Analysis
- **Time Complexity**: `O(N)` — Single pass traversal!
- **Space Complexity**: `O(1)` — In-place tracking without extra space!

---

## 🎯 Which approach would you like to implement & visualize?

Please choose one of the options below:
- **Option A (Optimal)**: Kadane's Algorithm (`O(N)` Single Pass, `O(1)` Space — Resets running sum when `sum < 0`).
- **Option B (Better)**: Two Nested Loops (`O(N^2)` Time, `O(1)` Space).
- **Option C (Brute Force)**: Three Nested Loops (`O(N^3)` Time).
