#include <cstdio>
#include <cstdlib>
#include <ctime>
#include <unistd.h>
#include <signal.h>
#include <fcntl.h>
#include <sys/resource.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <sys/wait.h>
#include <sys/time.h>

struct timeval start, end;
struct rusage ru;
pid_t i_pid, p_pid;
bool ok;

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
    if (WTERMSIG(p_sta) == SIGXCPU || WTERMSIG(p_sta) == SIGKILL) printf("{ \"status\": \"Time Limit Exceeded\", ");
    else if (WTERMSIG(p_sta) == SIGSEGV) printf("{ \"status\": \"Memory Limit Exceeded\", ");
    else if (WIFEXITED(p_sta) || (WIFSIGNALED(p_sta) && WTERMSIG(p_sta) == SIGPIPE)) {
        if (WIFEXITED(i_sta)) {
            if (WEXITSTATUS(i_sta) == 1) printf("{ \"status\": \"Invalid Output\", ");
            else if (WEXITSTATUS(i_sta) == 0) ok = 1, printf("{ \"status\": \"Accepted\", ");
        } else if (WIFSIGNALED(i_sta) && WTERMSIG(i_sta) == SIGPIPE) {
            printf("{ \"status\": \"Invalid Output\", ");
        }
    } else {
        printf("{ \"status\": \"Runtime Error\", ");
    }
}

void handler(int num) {
    kill(p_pid, SIGKILL);
    return ;
}

int main() {
    struct rlimit lim_time, lim_mem, lim_stack;

    lim_time.rlim_cur = 11, lim_time.rlim_max = 15;
    lim_mem.rlim_cur = 1024 * 1024 * (1024 + 128), lim_mem.rlim_max = 1024 * 1024 * (1024 + 512);
    lim_stack.rlim_cur = 1024 * 1024 * (1024 + 128), lim_stack.rlim_max = 1024 * 1024 * (1024 + 512);

    setrlimit(RLIMIT_CPU, &lim_time);
    setrlimit(RLIMIT_AS, &lim_mem);
    setrlimit(RLIMIT_STACK, &lim_stack);

    mkfifo("i2p", 0644), mkfifo("p2i", 0644);

    int i_sta, p_sta;

    i_pid = fork();
    if (i_pid == 0) interactor();
    p_pid = fork();
    gettimeofday(&start, NULL);
    if (p_pid == 0) {
        player();
    } else {
        signal(SIGALRM, handler);
        alarm(11);
        wait4(p_pid, &p_sta, 0, &ru);
    }
    gettimeofday(&end, NULL);

    waitpid(i_pid, &i_sta, 0);

    int time_used = (int)(end.tv_sec * 1000 + end.tv_usec / 1000 - start.tv_sec * 1000 - start.tv_usec / 1000),
        memory_used = ru.ru_maxrss;

    if (time_used > 10000) {
        printf("{ \"status\": \"Time Limit Exceeded\", ");
    } else if (memory_used > 1024 * 1024 * 1024) {
        printf("{ \"status\": \"Memory Limit Exceeded\", ");
    } else judge(i_sta, p_sta);

    printf("\"time\": %d, \"memory\": %d", time_used, memory_used);

    if (ok) {
        FILE *f = fopen("result", "r");
        int step;
        fscanf(f, "%d", &step);
        printf(", \"step\": %d }\n", step);
    } else printf(" }\n");

    unlink("i2p"), unlink("p2i");

    return 0;
}