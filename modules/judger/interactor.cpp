#include <bits/stdc++.h>

using namespace std;

const int N = 15, M = 15;
const int nx[] = {-1, 1, 0, 0},
          ny[] = {0, 0, -1, 1};

int sx, sy, tx, ty, mp[N + 10][M + 10];
mt19937 rnd(20230629);

bool chk(int x, int y) {
    return x >= 1 && x <= N && y >= 1 && y <= M;
}

namespace MazeGenerator {
    #define id(x, y) (((x) - 1) * M + (y))
    int fa[N * M + 10];
    vector<tuple<int, int, int, int>> edges;

    int findfa(int u) { return u == fa[u] ? u : fa[u] = findfa(fa[u]); }
    void merge(int i, int j, int x, int y) {
        int u = findfa(id(i, j)), v = findfa(id(x, y));
        if (u != v) fa[u] = v;
    }
    bool chkin(int i, int j, int x, int y) {
        int u = findfa(id(i, j)), v = findfa(id(x, y));
        return u == v;
    }
    void Init() {
        for (int i = 0; i <= N + 1; i++) for (int j = 0; j <= M + 1; j++) mp[i][j] = 1;
        for (int i = 1; i <= N; i += 2) for (int j = 1; j <= M; j += 2) mp[i][j] = 0;
        for (int i = 1; i <= N; i++) for (int j = 1; j <= M; j++) fa[id(i, j)] = id(i, j);
    }
    void print() {
        for (int i = 1; i <= N; i++, puts(""))
            for (int j = 1; j <= M; j++) printf("%d ", mp[i][j]);
    }
    void Generate() {
        for (int i = 1; i <= N; i += 2) for (int j = 1; j <= M; j += 2) edges.emplace_back(i, j, i + 2, j), edges.emplace_back(i, j, i, j + 2);
        shuffle(edges.begin(), edges.end(), rnd);
        for (auto [i, j, x, y] : edges) {
            if (chk(x, y) == 0) continue;
            int u = findfa(id(i, j)), v = findfa(id(x, y));
            if (u == v) continue;
            fa[u] = v;
            if (i == x) mp[i][j + 1] = 0;
            else mp[i + 1][j] = 0;
        }
        sx = 1, sy = 1, tx = N, ty = M;
    }
} // namespace MazeGenerator

namespace Interactor {
    int curx, cury, step;
    string cmd;
    void main() {
        bool flag = 0;
        while (cin >> cmd) {
            if (cmd == "start") flag = 1, curx = sx, cury = sy, puts("ok"), fflush(stdout);
            else if (cmd == "target") {
                if (flag == 0) exit(1);
                printf("ok %d %d\n", tx, ty), fflush(stdout);
            } else if (cmd == "info") {
                if (flag == 0) exit(1);
                printf("ok %d %d", curx, cury);
                for (int d = 0; d < 4; d++) printf(" %d", mp[curx + nx[d]][cury + ny[d]]);
                puts(""), fflush(stdout);
            } else if (cmd == "move") {
                int d;
                if (scanf("%d", &d) != 1) exit(1);
                if (d < 1 || d > 4) exit(1);
                int x = curx + nx[d], y = cury + ny[d];
                if (chk(x, y) == 0) exit(1);
                if (mp[x][y]) exit(1);
                curx = x, cury = y, step++;
                if (curx == tx && cury == ty) {
                    FILE *f = fopen("result", "w");
                    fprintf(f, "%d\n", step);
                    puts("success"), fflush(stdout), exit(0);
                } else puts("ok"), fflush(stdout), exit(1);
            }
        }
    }
} // namespace Interactor

int main() {
    MazeGenerator::Init();
    MazeGenerator::Generate();
    Interactor::main();
    return 0;
}