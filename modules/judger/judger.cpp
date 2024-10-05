#include <cstdio>
#include <unistd.h>
#include <signal.h>
#include <fcntl.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <sys/wait.h>

void interactor() {
    int in = open("p2i", O_RDONLY), out = open("i2p", O_WRONLY);
    dup2(in, 0), dup2(out, 1);
    close(in), close(out);
    execl("interactor", "interactor", NULL);
}
void player() {
    int out = open("p2i", O_WRONLY), in = open("i2p", O_RDONLY);
    dup2(in, 0), dup2(out, 1);
    close(in), close(out);
    execl("player", "player", NULL);
}

void judge(int i_sta, int p_sta) {
    if (WIFEXITED(p_sta) || (WIFSIGNALED(p_sta) && WTERMSIG(p_sta) == SIGPIPE)) {
        if (WIFEXITED(i_sta)) {
            if (WEXITSTATUS(i_sta) == 1) printf("Invalid Output\n");
            else if (WEXITSTATUS(i_sta) == 0) printf("Accepted\n");
        } else if (WIFSIGNALED(i_sta) && WTERMSIG(i_sta) == SIGPIPE) {
            printf("Invalid Output\n");
        }
    } else {
        printf("Runtime Error\n");
    }
}

int main() {
    mkfifo("i2p", 0644), mkfifo("p2i", 0644);

    pid_t i_pid, p_pid;
    i_pid = fork();
    if (i_pid == 0) return interactor(), 0;
    p_pid = fork();
    if (p_pid == 0) return player(), 0;

    int i_sta, p_sta;
    waitpid(i_pid, &i_sta, 0), waitpid(p_pid, &p_sta, 0);
    judge(i_sta, p_sta);

    unlink("i2p"), unlink("p2i");

    return 0;
}