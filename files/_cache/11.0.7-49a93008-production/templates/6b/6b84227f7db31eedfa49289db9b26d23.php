<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Extension\CoreExtension;
use Twig\Extension\SandboxExtension;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;
use Twig\TemplateWrapper;

/* __string_template__884e6288981161560976c5a18972db07 */
class __TwigTemplate_3e16711c140f26e3c3c74cefe530c201 extends Template
{
    private Source $source;
    /**
     * @var array<string, Template>
     */
    private array $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->parent = false;

        $this->blocks = [
        ];
    }

    protected function doDisplay(array $context, array $blocks = []): iterable
    {
        $macros = $this->macros;
        // line 1
        yield "            ";
        $macros["inputs"] = $this->macros["inputs"] = $this->load("components/form/basic_inputs_macros.html.twig", 1)->unwrap();
        // line 2
        yield "            <form method=\"get\" action=\"";
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($this->extensions['Glpi\Application\View\Extension\ItemtypeExtension']->getItemtypeSearchPath("KnowbaseItem"), "html", null, true);
        yield "\" class=\"d-flex justify-content-center\">
                ";
        // line 3
        yield $macros["inputs"]->getTemplateForMacro("macro_text", $context, 3, $this->getSourceContext())->macro_text(...["contains", ($context["contains"] ?? null), ["additional_attributes" => ["size" => 50], "input_addclass" => "me-1"]]);
        yield "
                ";
        // line 4
        yield $macros["inputs"]->getTemplateForMacro("macro_submit", $context, 4, $this->getSourceContext())->macro_submit(...["search", ($context["btn_msg"] ?? null), 1]);
        yield "
                ";
        // line 5
        if ((CoreExtension::getAttribute($this->env, $this->source, ($context["options"] ?? null), "item_itemtype", [], "any", true, true, false, 5) && CoreExtension::getAttribute($this->env, $this->source, ($context["options"] ?? null), "item_items_id", [], "any", true, true, false, 5))) {
            // line 6
            yield "                    ";
            yield $macros["inputs"]->getTemplateForMacro("macro_hidden", $context, 6, $this->getSourceContext())->macro_hidden(...["item_itemtype", CoreExtension::getAttribute($this->env, $this->source, ($context["options"] ?? null), "item_itemtype", [], "any", false, false, false, 6)]);
            yield "
                    ";
            // line 7
            yield $macros["inputs"]->getTemplateForMacro("macro_hidden", $context, 7, $this->getSourceContext())->macro_hidden(...["item_items_id", CoreExtension::getAttribute($this->env, $this->source, ($context["options"] ?? null), "item_items_id", [], "any", false, false, false, 7)]);
            yield "
                ";
        }
        // line 9
        yield "                ";
        yield $macros["inputs"]->getTemplateForMacro("macro_hidden", $context, 9, $this->getSourceContext())->macro_hidden(...["glpi_csrf_token", Session::getNewCSRFToken()]);
        yield "
            </form>";
        yield from [];
    }

    /**
     * @codeCoverageIgnore
     */
    public function getTemplateName(): string
    {
        return "__string_template__884e6288981161560976c5a18972db07";
    }

    /**
     * @codeCoverageIgnore
     */
    public function isTraitable(): bool
    {
        return false;
    }

    /**
     * @codeCoverageIgnore
     */
    public function getDebugInfo(): array
    {
        return array (  70 => 9,  65 => 7,  60 => 6,  58 => 5,  54 => 4,  50 => 3,  45 => 2,  42 => 1,);
    }

    public function getSourceContext(): Source
    {
        return new Source("", "__string_template__884e6288981161560976c5a18972db07", "");
    }
}
