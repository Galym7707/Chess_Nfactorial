@echo off
set ANTHROPIC_BASE_URL=http://localhost:20128/v1
set ANTHROPIC_AUTH_TOKEN=sk-2c08eff01621ac90-a3c175-87b57c5a
set ANTHROPIC_API_KEY=
set ANTHROPIC_MODEL=kr/claude-sonnet-4.5
set ANTHROPIC_SMALL_FAST_MODEL=kr/claude-sonnet-4.5
set CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1
claude --dangerously-skip-permissions %*