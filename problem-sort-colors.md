# Problem Explanation: Sort Colors (Sort 0s, 1s, and 2s) — LeetCode 75 🎨

Given an array `nums` with `n` objects colored red, white, or blue, sort them **in-place** so that objects of the same color are adjacent, with the colors in the order red, white, and blue.

We will use the integers `0`, `1`, and `2` to represent the color red, white, and blue, respectively.

You must solve this problem without using the library's sort function.

---

## 📌 Problem Constraints
- `n == nums.length`
- `1 <= n <= 300`
- `nums[i]` is either `0`, `1`, or `2`.
- **In-place Sorting Required** (`O(1)` extra memory).

---

## 🧠 Approach 1: Brute Force Approach (Standard Sorting)

### 💡 Intuition & Logic (Why & How)
Sabse simple tarika yeh hai ki hum array ko standard sorting algorithm (jaise QuickSort, MergeSort ya `Array.prototype.sort()`) se sort kar dein.

### ⏱️ Complexity Analysis
- **Time Complexity**: `O(N log N)` — Swaps aur comparisons ke zariye.
- **Space Complexity**: `O(1)` (ya `O(N)` depending on sorting implementation).

---

## 🧠 Approach 2: Better Approach (Counting 0s, 1s, and 2s)

### 💡 Intuition & Logic (Why & How)
Humein pata hai ki array mein sirf 3 unique values hain: `0`, `1`, aur `2`.
1. **First Pass**: Array ko traverse karke count kar lo ki kitne `0`s, `1`s, aur `2`s hain.
   - `count0`, `count1`, `count2`
2. **Second Pass**: Array mein pehle `count0` baar `0` daalo, fir `count1` baar `1` daalo, aur baaki jagah `2` daalo.

### ⏱️ Complexity Analysis
- **Time Complexity**: `O(2N) = O(N)` — Array ko 2 baar traverse karna padta hai.
- **Space Complexity**: `O(1)` — Sirf 3 variables use hote hain.

---

## 🧠 Approach 3: Optimal Approach (Dutch National Flag Algorithm - 3 Pointers) 🌟

### 💡 Intuition & Logic (Why & How)
Yeh Edsger Dijkstra ki famous **Dutch National Flag Algorithm** hai. Isme hum **Single Pass `O(N)`** mein **3 Pointers** (`low`, `mid`, `high`) use karke array ko 4 virtual sections mein divide karte hain:

```
[0 ... low - 1]     ---> All 0s (Sorted Red)
[low ... mid - 1]   ---> All 1s (Sorted White)
[mid ... high]      ---> Unsorted / Unknown elements
[high + 1 ... n - 1] ---> All 2s (Sorted Blue)
```

### 🔄 Algorithm Steps (How `mid` moves):
Initial State: `low = 0`, `mid = 0`, `high = n - 1`

While `mid <= high`:
1. **Case `nums[mid] == 0`**:
   - `swap(nums[low], nums[mid])`
   - `low++`, `mid++`
   *(Kyunk `0` ko `[0 ... low-1]` section mein jaana hai)*

2. **Case `nums[mid] == 1`**:
   - `mid++`
   *(Kyunk `1` already sahi place par hai `[low ... mid-1]` section mein)*

3. **Case `nums[mid] == 2`**:
   - `swap(nums[mid], nums[high])`
   - `high--`
   *(Kyunk `2` ko `[high+1 ... n-1]` section mein bhejna hai. Note: `mid` ko yahan increment nahi karte kyunki swapped element check hona baaki hai!)*

### ⏱️ Complexity Analysis
- **Time Complexity**: `O(N)` — Sirf 1 Pass mein poora array sort ho jata hai.
- **Space Complexity**: `O(1)` — In-place swap without extra space!

---

## 🎯 Which approach would you like to implement & visualize?

Please choose one of the options below:
- **Option A (Optimal)**: Dutch National Flag Algorithm (3 Pointers `low`, `mid`, `high` — `O(N)` time, `O(1)` space, 1 Pass).
- **Option B (Better)**: Counting Frequency Pass (`O(2N)` time, `O(1)` space, 2 Passes).
- **Option C (Brute Force)**: Basic Sorting (`O(N log N)` time).
