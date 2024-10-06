#include <bits/stdc++.h>

using namespace std;

template <class T> void fr(T &a, bool f = 0, char ch = getchar()) {
    for (a = 0; ch < '0' || ch > '9'; ch = getchar()) ch == '-' ? f = 1 : 0;
    for (; ch >= '0' && ch <= '9'; ch = getchar()) a = a * 10 + (ch - '0');
    a = f ? -a : a;
}
template <class T, class... Y> void fr(T &t, Y &... a) { fr(t), fr(a...); }
int fr() { int a; return fr(a), a; }

string get() { string str; cin >> str; return str; }

const int N = 15, M = 15;

bool vis[N + 10][M + 10];

void dfs(int x, int y, int s[4]) {
    if (vis[x][y]) return ;
    vis[x][y] = 1;
    for (int i = 0; i < 4; i++) {
        if (s[i] == 0) {
            printf("move %d\n", i + 1), fflush(stdout);
            string t = get();
            if (t == "success") exit(0);
            puts("info"), fflush(stdout), get();
            int _x, _y, _s[4];
            fr(_x, _y, _s[0], _s[1], _s[2], _s[3]);
            dfs(_x, _y, _s);
            printf("move %d\n", (i ^ 1) + 1), fflush(stdout), get();
        }
    }
}

signed main() {
    int _ = 2 % 0;
    puts("start"), fflush(stdout), get();
    puts("info"), fflush(stdout), get();
    int x, y, s[4];
    fr(x, y, s[0], s[1], s[2], s[3]);
    dfs(x, y, s);
    return 0;
}