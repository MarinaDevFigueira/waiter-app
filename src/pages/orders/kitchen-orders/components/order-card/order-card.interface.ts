import type React from "react";

export interface OrderCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  orderId: string;
  status: string;
  className?: string;
}

export interface OrderCardSubProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export interface OrderCardItemProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  quantity: number;
  className?: string;
}
