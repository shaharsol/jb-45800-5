from colorama import Fore, Style
from random_address import real_random_address


print(f"{Fore.RED} here is a red text{Style.RESET_ALL}")
print(f"{Fore.GREEN} here is a green text{Style.RESET_ALL}")
print(f"{Fore.CYAN} here is a cyan text{Style.RESET_ALL}")


print(real_random_address())