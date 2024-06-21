#!/bin/bash

HOME=/home/solana/solanadama_be
PID_FILE=$HOME/solanadama.pid

case $1 in

start)
        if [ -f $PID_FILE ]; then
                PIDVAL=`cat $PID_FILE`
                RESULT=`ps -p $PIDVAL | grep $PIDVAL`
                if [  ! -z "$RESULT" ]; then
                        echo "Solanadama backend is already running with PID " $PIDVAL
                        exit 1
                fi
        fi

        export COMMAND="ts-node "$HOME"/src/index.ts "$HOME
        echo $COMMAND
        nohup $COMMAND 2>&1 1>>$HOME/log/nohup.out &
        echo $! > $PID_FILE

        if [ -f $PID_FILE ]; then
                PIDVAL=`cat $PID_FILE`
                RESULT=`ps -p $PIDVAL | grep $PIDVAL`
                if [  ! -z "$RESULT" ]; then
                        echo "Solanadama backend is running with PID " $PIDVAL
                        exit 0
                fi
        fi

        echo "Solanadama backend start ERROR"
        exit 2
        ;;

stop)

if [ -f $PID_FILE ] ;then
        kill -9 `cat $PID_FILE`;
        if [ $? != 0 ]; then
            echo "SIGTERM failed. Try to using SIGKILL..."
            kill -9 `cat $PID_FILE`;
        fi
        rm -f $PID_FILE
        echo "Solanadama backend is stopped"
          exit 0
fi
;;

status)

        if [ -f $PID_FILE ]; then
                PIDVAL=`cat $PID_FILE`
                RESULT=`ps -p $PIDVAL | grep $PIDVAL`
                if [  ! -z "$RESULT" ]; then
                        echo "Solanadama backend is running with PID " $PIDVAL
                        exit 0
                fi
                echo "Solanadama backend is not running"
                exit -1
        fi
;;

  *)
        echo "Usage: $0 {start|stop|status}"
        exit 1
        ;;

esac

exit 0