FROM ghcr.io/steamdeckhomebrew/holo-base:latest

RUN pacman -Sy --noconfirm git pkgconf gtkmm3

ENTRYPOINT [ "/backend/entrypoint.sh" ]