#!python
import csv
import time
import psycopg2
import logging

def test():
    print("this is as test script.")


def main():
    try:
        print("Calling test module")
        test()
        print("Done")
    except Exception as e:
        print(f"Failed to call test module. {e}")
    finally:
        print("End")


if __name__ == "__main__":
    main()