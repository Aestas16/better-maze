#include <cstdio>
#include <cstdlib>
#include <unistd.h>
#include <signal.h>
#include <sys/wait.h>

char str[100000];

void handler(int num)
{
    printf("Compile Error\n");
    exit(1);
}

int main() {
    pid_t c_pid;
    int c_sta;
    c_pid = fork();
    if (c_pid == 0) {
        if (system("(g++ player.cpp -o player) 2> compile") == 256) return 1;
        return 0;
    } else {
        signal(SIGALRM, handler);
        alarm(3);
        waitpid(c_pid, &c_sta, 0);
    }

    if (c_sta) {
        printf("Compile Error\n");
        FILE *f = fopen("compile", "r");
        while (fgets(str, 100000, f) != NULL) {
            // fputs(str, stderr);
            puts(str);
        }
    }
    return c_sta;
}